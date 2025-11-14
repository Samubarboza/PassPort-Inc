import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

import { modeloUsuario } from '../models/modeloUsuario.js';
import { modeloSesion } from '../models/modeloSesion.js';
import { validarCorreoYContrasena } from '../security/validarEntradas.js';
import { emitirTokenJWE } from '../security/gestorJWT.js';
import { respuestasEstandar } from '../utils/respuestasEstandar.js';

export const limiteIntentosInicioSesion = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false
});

export function controladorCSRF(req, res) {
    res.json(respuestasEstandar.ok({ tokenCSRFParaFormulario: req.csrfToken() }));
}

export async function controladorRegistro(req, res) {
    try {
        const { correoElectronico, contrasenaPlano } = req.body;
        const { correoSanitizado, contrasenaSanitizada } =
        validarCorreoYContrasena({ correoElectronico, contrasenaPlano });

        const yaExiste = modeloUsuario.buscarUsuarioPorCorreo(correoSanitizado);
        if (yaExiste)
            return res.status(409).json(respuestasEstandar.error('correo ya registrado'));

        const hashContrasena = await bcrypt.hash(
            contrasenaSanitizada,
            Number(process.env.CLAVE_SECRETA_BCRYPT_SALT_ROUNDS)
        );

        const nuevo = modeloUsuario.crearUsuarioConHash({
            correoElectronico: correoSanitizado,
            hashContrasena,
            rolUsuario: 'Usuario'
        });

        res.json(respuestasEstandar.ok({ idUsuario: nuevo.id, correoElectronico: nuevo.correoElectronico })
        );
    } catch (e) {
        res.status(400).json(respuestasEstandar.error(e.message || 'error registro'));
    }
}

export async function controladorInicioSesion(req, res) {
    try {
        const { correoElectronico, contrasenaPlano, preferirJWT } = req.body;
        const { correoSanitizado, contrasenaSanitizada } =
        validarCorreoYContrasena({ correoElectronico, contrasenaPlano });

        const usuario = modeloUsuario.buscarUsuarioPorCorreo(correoSanitizado);

        if (!usuario)
            return res.status(401).json(respuestasEstandar.error('credenciales invalidas'));

        const coincide = await bcrypt.compare(contrasenaSanitizada, usuario.hashContrasena);

        if (!coincide)
            return res.status(401).json(respuestasEstandar.error('credenciales invalidas'));

        if (preferirJWT) {
            try {
                const tokenJWE = await emitirTokenJWE({ idUsuario: usuario.id,
                    rolUsuario: usuario.rolUsuario
                });

                return res.json(respuestasEstandar.ok({ tokenJWE }));
            } catch (error) {
                console.error('Error emitiendo JWE:', error);
                return res.status(500).json(respuestasEstandar.error('error emitiendo JWE'));}
        } else {
            const { idSesion, expiraEnEpoch } = modeloSesion.crearSesionParaUsuario(usuario.id,Number(process.env.DURACION_MINUTOS_SESION));

            res.cookie('idSesionSeguro', idSesion, {
                httpOnly: true,
                secure: process.env.NIVEL_ENTORNO === 'produccion',
                sameSite: 'strict',
                path: '/'
            });

            return res.json(respuestasEstandar.ok({
                sesionExpiraEnEpoch: expiraEnEpoch,
                idUsuario: usuario.id,
                rolUsuario: usuario.rolUsuario})
            );
        }
    } catch {
        res.status(400).json(respuestasEstandar.error('error inicio sesion'));
    }
}

export function controladorCerrarSesion(req, res) {
    const idSesion = req.cookies?.idSesionSeguro;
    if (idSesion) modeloSesion.eliminarSesion(idSesion);

    res.clearCookie('idSesionSeguro', { path: '/' });
    res.json(respuestasEstandar.ok({ mensaje: 'sesion cerrada' }));
}
