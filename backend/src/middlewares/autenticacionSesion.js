import { modeloSesion } from '../models/modeloSesion.js';
import { modeloUsuario } from '../models/modeloUsuario.js';

export async function requerirSesionValida(req, res, next) {
    const idSesion = req.cookies?.idSesionSeguro;
    if (!idSesion) return res.status(401).json({ ok:false, mensaje:'sesion no presente' });
    const sesion = modeloSesion.obtenerSesionValida(idSesion);
    if (!sesion) return res.status(401).json({ ok:false, mensaje:'sesion invalida' });
    const usuario = modeloUsuario.buscarUsuarioPorId(sesion.idUsuario);
    if (!usuario) return res.status(401).json({ ok:false, mensaje:'usuario no existe' });
    req.usuarioAutenticado = usuario;
    return next();
}
