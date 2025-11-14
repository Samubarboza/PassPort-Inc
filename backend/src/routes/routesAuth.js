import { Router } from 'express';
import { proteccionCSRF } from '../middlewares/proteccionCSRF.js';

import { limiteIntentosInicioSesion,
    controladorCSRF,
    controladorRegistro,
    controladorInicioSesion,
    controladorCerrarSesion } from '../controllers/controladorAuth.js';

const router = Router();

// GET CSRF
router.get('/csrf-token', proteccionCSRF, controladorCSRF);

// registro
router.post('/registro', proteccionCSRF, controladorRegistro);

// login
router.post(
    '/inicio-sesion',
    proteccionCSRF,
    limiteIntentosInicioSesion,
    controladorInicioSesion
);

// cerrar sesion
router.post('/cerrar-sesion', proteccionCSRF, controladorCerrarSesion);

export default router;
