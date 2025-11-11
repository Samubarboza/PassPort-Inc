import { Router } from 'express';
import csrf from 'csurf';
import { requerirSesionValida } from '../middlewares/autenticacionSesion.js';
import { requerirJWTValido } from '../middlewares/autenticacionJWT.js';
import { permitirSoloRoles } from '../middlewares/controlAccesoPorRol.js';
import { respuestasEstandar } from '../utils/respuestasEstandar.js';
import { modeloSesion } from '../modelos/modeloSesion.js';
import { modeloUsuario } from '../modelos/modeloUsuario.js';

const proteccionCSRF = csrf({ cookie: true });
const router = Router();

// Verificar si la cookie de sesión sigue siendo válida (para restaurar sesión en frontend)
router.get('/verificar-sesion', (req, res) => {
    const idSesion = req.cookies?.idSesionSeguro;
    if (!idSesion) return res.status(401).json(respuestasEstandar.error('sesionNoPresente'));
    
    const sesion = modeloSesion.buscarSesionPorId(idSesion);
    if (!sesion) return res.status(401).json(respuestasEstandar.error('sesionInvalida'));
    
    const usuario = modeloUsuario.buscarUsuarioPorId(sesion.idUsuario);
    if (!usuario) return res.status(401).json(respuestasEstandar.error('usuarioNoExiste'));
    
    res.json(respuestasEstandar.ok({
        idUsuario: usuario.id,
        rolUsuario: usuario.rolUsuario
    }));
});

//  Rutas protegidas por sesión
router.get('/perfil-sesion', requerirSesionValida, (req, res) => {
    res.json(respuestasEstandar.ok({
        idUsuario: req.usuarioAutenticado.id,
        correoElectronico: req.usuarioAutenticado.correoElectronico,
        rolUsuario: req.usuarioAutenticado.rolUsuario
    }));
});

router.post('/solo-admin-sesion', requerirSesionValida, proteccionCSRF, permitirSoloRoles(['Administrador']), (req, res) => {
    res.json(respuestasEstandar.ok({ accion: 'administrativaConSesion' }));
});

//  Rutas protegidas por JWT
router.get('/perfil-jwt', requerirJWTValido, (req, res) => {
    res.json(respuestasEstandar.ok({
        idUsuario: req.datosTokenJWE.idUsuario,
        rolUsuario: req.datosTokenJWE.rolUsuario
    }));
});

router.post('/solo-admin-jwt', requerirJWTValido, permitirSoloRoles(['Administrador']), (req, res) => {
    res.json(respuestasEstandar.ok({ accion: 'administrativaConJWT' }));
});

export default router;
