import { modeloSesion } from '../modelos/modeloSesion.js';
import { modeloUsuario } from '../modelos/modeloUsuario.js';

export async function requerirSesionValida(req, res, next) {
    const idSesion = req.cookies?.idSesionSeguro;
    if (!idSesion) return res.status(401).json({ ok:false, mensaje:'sesionNoPresente' });
    const sesion = modeloSesion.obtenerSesionValida(idSesion);
    if (!sesion) return res.status(401).json({ ok:false, mensaje:'sesionInvalida' });
    const usuario = modeloUsuario.buscarUsuarioPorId(sesion.idUsuario);
    if (!usuario) return res.status(401).json({ ok:false, mensaje:'usuarioNoExiste' });
    req.usuarioAutenticado = usuario;
    return next();
}
