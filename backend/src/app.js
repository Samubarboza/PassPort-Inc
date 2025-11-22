import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rutasAuth from './routes/routesAuth.js';
import rutasPrivadas from './routes/rutasPrivadas.js';
import { crearAdministradorPorDefectoSiNoExiste } from './iniciarBaseDatos.js';

// creamos nuestra aplicacion express
const aplicacionServidor = express();

// configuracion de middleware
aplicacionServidor.use(helmet({ contentSecurityPolicy: false }));
aplicacionServidor.use(express.json());
aplicacionServidor.use(cookieParser());
aplicacionServidor.use(cors({
    origin: process.env.ORIGEN_PERMITIDO_FRONTEND,
    credentials: true
}));
// ruta de chequeo para ver si esta vivo el servidor
aplicacionServidor.get('/estado', (req, res) => res.json({ ok:true, mensaje:'servidor operativo' }));

aplicacionServidor.use('/auth', rutasAuth);
aplicacionServidor.use('/privado', rutasPrivadas);

const puerto = Number(process.env.PUERTO_SERVIDOR || 4000);
crearAdministradorPorDefectoSiNoExiste().then(() => {
    aplicacionServidor.listen(puerto, () => {
        console.log(`Servidor escuchando en http://localhost:${puerto}`);
    });
});
