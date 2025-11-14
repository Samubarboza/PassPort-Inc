// controladorPrivado.js
import { modeloSesion } from '../models/modeloSesion.js';
import { modeloUsuario } from '../models/modeloUsuario.js';
import { respuestasEstandar } from '../utils/respuestasEstandar.js';

// CONTROLADORES

export function controladorVerificarSesion(req, res) {
    const idSesion = req.cookies?.idSesionSeguro;
    if (!idSesion) 
        return res.status(401).json(respuestasEstandar.error('sesion no presente'));

    const sesion = modeloSesion.buscarSesionPorId(idSesion);
    if (!sesion) 
        return res.status(401).json(respuestasEstandar.error('sesion invalida'));

    const usuario = modeloUsuario.buscarUsuarioPorId(sesion.idUsuario);
    if (!usuario) 
        return res.status(401).json(respuestasEstandar.error('usuario no existe'));

    res.json(respuestasEstandar.ok({
        idUsuario: usuario.id,
        rolUsuario: usuario.rolUsuario
    }));
}

export function controladorPerfilSesion(req, res) {
    res.json(respuestasEstandar.ok({
        idUsuario: req.usuarioAutenticado.id,
        correoElectronico: req.usuarioAutenticado.correoElectronico,
        rolUsuario: req.usuarioAutenticado.rolUsuario
    }));
}

export function controladorSoloAdminSesion(req, res) {
    res.json(respuestasEstandar.ok({ accion: 'administrativa con sesion' }));
}

export function controladorPerfilJWT(req, res) {
    res.json(respuestasEstandar.ok({
        idUsuario: req.datosTokenJWE.idUsuario,
        rolUsuario: req.datosTokenJWE.rolUsuario
    }));
}

export function controladorSoloAdminJWT(req, res) {
    res.json(respuestasEstandar.ok({ accion: 'administrativa con JWT' }));
}
