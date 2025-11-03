import { Router } from 'express';
import csrf from 'csurf';
import { requerirSesionValida } from '../middlewares/autenticacionSesion.js';
import { requerirJWTValido } from '../middlewares/autenticacionJWT.js';
import { permitirSoloRoles } from '../middlewares/controlAccesoPorRol.js';
import { respuestasEstandar } from '../utils/respuestasEstandar.js';

const proteccionCSRF = csrf({ cookie: true });
const router = Router();

// Rutas protegidas por SESIÓN (CSRF requerido porque hay cookie)
router.get('/perfil-sesion', requerirSesionValida, (req, res) => {
    res.json(respuestasEstandar.ok({ idUsuario: req.usuarioAutenticado.id, correoElectronico: req.usuarioAutenticado.correoElectronico, rolUsuario: req.usuarioAutenticado.rolUsuario }));
});
router.post('/solo-admin-sesion', requerirSesionValida, proteccionCSRF, permitirSoloRoles(['Administrador']), (req, res) => {
    res.json(respuestasEstandar.ok({ accion:'administrativaConSesion' }));
});

// Rutas protegidas por JWT (no requiere CSRF si se usa Authorization header)
router.get('/perfil-jwt', requerirJWTValido, (req, res) => {
    res.json(respuestasEstandar.ok({ idUsuario: req.datosTokenJWE.idUsuario, rolUsuario: req.datosTokenJWE.rolUsuario }));
});
router.post('/solo-admin-jwt', requerirJWTValido, permitirSoloRoles(['Administrador']), (req, res) => {
    res.json(respuestasEstandar.ok({ accion:'administrativaConJWT' }));
});

export default router;
