import { verificarTokenJWE } from '../security/gestorJWT.js';

export async function requerirJWTValido(req, res, next) {
    try {
        const encabezado = req.headers['authorization'] || '';
        const token = encabezado.startsWith('Bearer ') ? encabezado.slice(7) : null;
        if (!token) return res.status(401).json({ ok:false, mensaje:'jwt no presente' });
        const datos = await verificarTokenJWE(token);
        req.datosTokenJWE = datos; // { idUsuario, rolUsuario, emitidoEnISO }
            return next();
    } catch {
        return res.status(401).json({ ok:false, mensaje:'jwt invalido' });
    }
}
