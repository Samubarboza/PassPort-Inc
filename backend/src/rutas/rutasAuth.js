import { Router } from 'express';
import bcrypt from 'bcrypt';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import { modeloUsuario } from '../modelos/modeloUsuario.js';
import { modeloSesion } from '../modelos/modeloSesion.js';
import { validarCorreoYContrasena } from '../seguridad/validarEntradas.js';
import { emitirTokenJWE } from '../seguridad/gestorJWT.js';
import { respuestasEstandar } from '../utils/respuestasEstandar.js';

const router = Router();
const proteccionCSRF = csrf({ cookie: true });
const limiteIntentosInicioSesion = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false
});

router.get('/csrf-token', proteccionCSRF, (req, res) => {
    res.json(respuestasEstandar.ok({ tokenCSRFParaFormulario: req.csrfToken() }));
});

// Registro (escudo CSRF)
router.post('/registro', proteccionCSRF, async (req, res) => {
    try {
        const { correoElectronico, contrasenaPlano } = req.body;
        const { correoSanitizado, contrasenaSanitizada } = validarCorreoYContrasena({ correoElectronico, contrasenaPlano });
        const yaExiste = modeloUsuario.buscarUsuarioPorCorreo(correoSanitizado);
        if (yaExiste) return res.status(409).json(respuestasEstandar.error('correoYaRegistrado'));
        const hashContrasena = await bcrypt.hash(contrasenaSanitizada, Number(process.env.CLAVE_SECRETA_BCRYPT_SALT_ROUNDS));
        const nuevo = modeloUsuario.crearUsuarioConHash({ correoElectronico: correoSanitizado, hashContrasena, rolUsuario:'Usuario' });
        res.json(respuestasEstandar.ok({ idUsuario: nuevo.id, correoElectronico: nuevo.correoElectronico }));
    } catch (e) {
        res.status(400).json(respuestasEstandar.error(e.message || 'errorRegistro'));
    }
});

// Login (rate limit + CSRF)
router.post('/inicio-sesion', proteccionCSRF, limiteIntentosInicioSesion, async (req, res) => {
    try {
        const { correoElectronico, contrasenaPlano, preferirJWT } = req.body;
        const { correoSanitizado, contrasenaSanitizada } = validarCorreoYContrasena({ correoElectronico, contrasenaPlano });
        const usuario = modeloUsuario.buscarUsuarioPorCorreo(correoSanitizado);
        if (!usuario) return res.status(401).json(respuestasEstandar.error('credencialesInvalidas'));
        const coincide = await bcrypt.compare(contrasenaSanitizada, usuario.hashContrasena);
        if (!coincide) return res.status(401).json(respuestasEstandar.error('credencialesInvalidas'));
        
        if (preferirJWT) {
            const tokenJWE = await emitirTokenJWE({ idUsuario: usuario.id, rolUsuario: usuario.rolUsuario });
            return res.json(respuestasEstandar.ok({ tokenJWE }));
        } else {
            const { idSesion, expiraEnEpoch } = modeloSesion.crearSesionParaUsuario(
                usuario.id, Number(process.env.DURACION_MINUTOS_SESION)
            );
            res.cookie('idSesionSeguro', idSesion, {
                httpOnly: true,
                secure: process.env.NIVEL_ENTORNO === 'produccion',
                sameSite: 'strict',
                path: '/'
            });
            return res.json(respuestasEstandar.ok({
                sesionExpiraEnEpoch: expiraEnEpoch,
                idUsuario: usuario.id,
                rolUsuario: usuario.rolUsuario
            }));
        }
    } catch {
        res.status(400).json(respuestasEstandar.error('errorInicioSesion'));
    }
});

// Cerrar sesión (CSRF)
router.post('/cerrar-sesion', proteccionCSRF, (req, res) => {
    const idSesion = req.cookies?.idSesionSeguro;
    if (idSesion) modeloSesion.eliminarSesion(idSesion);
    res.clearCookie('idSesionSeguro', { path:'/' });
    res.json(respuestasEstandar.ok({ mensaje:'sesionCerrada' }));
});

export default router;
