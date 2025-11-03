import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rutasAuth from './rutas/rutasAuth.js';
import rutasPrivadas from './rutas/rutasPrivadas.js';
import { crearAdministradorPorDefectoSiNoExiste } from './iniciarBaseDatos.js';

const aplicacionServidor = express();

aplicacionServidor.use(helmet({ contentSecurityPolicy: false }));
aplicacionServidor.use(express.json());
aplicacionServidor.use(cookieParser());

// CORS: permitir frontend
aplicacionServidor.use(cors({
    origin: process.env.ORIGEN_PERMITIDO_FRONTEND,
    credentials: true
}));

aplicacionServidor.get('/estado', (req, res) => res.json({ ok:true, mensaje:'servidorOperativo' }));

aplicacionServidor.use('/auth', rutasAuth);
aplicacionServidor.use('/privado', rutasPrivadas);

const puerto = Number(process.env.PUERTO_SERVIDOR || 4000);
crearAdministradorPorDefectoSiNoExiste().then(() => {
    aplicacionServidor.listen(puerto, () => {
        console.log(`Servidor escuchando en http://localhost:${puerto}`);
    });
});
