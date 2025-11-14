import { Router } from 'express';
import { proteccionCSRF } from '../middlewares/proteccionCSRF.js';

import { controladorVerificarSesion,
    controladorPerfilSesion,
    controladorSoloAdminSesion,
    controladorPerfilJWT,
    controladorSoloAdminJWT } from '../controllers/controladorPrivado.js';

import { requerirSesionValida } from '../middlewares/autenticacionSesion.js';
import { requerirJWTValido } from '../middlewares/autenticacionJWT.js';
import { permitirSoloRoles } from '../middlewares/controlAccesoPorRol.js';

const router = Router();

// restaurar sesion desde cookie
router.get('/verificar-sesion', controladorVerificarSesion);

// perfil usando sesion
router.get('/perfil-sesion', requerirSesionValida, controladorPerfilSesion);

// solo admin usando sesion
router.post(
    '/solo-admin-sesion',
    requerirSesionValida,
    proteccionCSRF,
    permitirSoloRoles(['Administrador']),
    controladorSoloAdminSesion
);

// perfil usando JWT
router.get('/perfil-jwt', requerirJWTValido, controladorPerfilJWT);

// solo admin usando JWT
router.post(
    '/solo-admin-jwt',
    requerirJWTValido,
    permitirSoloRoles(['Administrador']),
    controladorSoloAdminJWT
);

export default router;
