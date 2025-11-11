import 'dotenv/config'; // importamos la variables de entorno
import express from 'express';
import helmet from 'helmet'; // paquete para agregar cabeceras de seguridad al servidor
import cookieParser from 'cookie-parser'; // permite leer cookies en las peticiones
import cors from 'cors'; // permite que el front se comunique con el back aunque esten en dominios distintos
import rutasAuth from './rutas/rutasAuth.js';
import rutasPrivadas from './rutas/rutasPrivadas.js';
import { crearAdministradorPorDefectoSiNoExiste } from './iniciarBaseDatos.js';

// creamos nuestra aplicacion express
const aplicacionServidor = express();

// helmet usamos como middlewares, libreria de seguridad para express - usa cabeceras http
// contentSecurity es una barrera de seguridad que agrega helmet al servidor - esto desabilita algunas 
aplicacionServidor.use(helmet({ contentSecurityPolicy: false }));
// middleware que lee y convierte json a un objeto js
aplicacionServidor.use(express.json());
// middleware que lee las cookies y convierte a un objeto js
aplicacionServidor.use(cookieParser());
// middleware CORS: sirve para que el front pueda hacer peticiones al backend - el servidor viene de otro dominio por eso necesitamos esto
// por defecto el navegador bloquea cualquier pedido que venga de otro dominio, con este bloque controlamos eso para que se pueda comunicar el front con el back
aplicacionServidor.use(cors({
    origin: process.env.ORIGEN_PERMITIDO_FRONTEND,
    credentials: true
}));
// ruta llamada estado, cuando alguien entra a esta direccion el servidor responde con un json
aplicacionServidor.get('/estado', (req, res) => res.json({ ok:true, mensaje:'servidor Operativo' }));

// conectamos las rutas al servidor principal
// le decimos a express que esta ruta la maneje con rutasAuth
aplicacionServidor.use('/auth', rutasAuth);
// aca tambien le decimos que maneje con rutasPrivadas
aplicacionServidor.use('/privado', rutasPrivadas);

// configuramos el puerto en el que va a correr el servidor
const puerto = Number(process.env.PUERTO_SERVIDOR || 4000);
// ejecutamos la funcion que crea un usuario administrador y detenemos la ejecusion del servidor hasta que se cree el usuario administrador
crearAdministradorPorDefectoSiNoExiste().then(() => {
    // una vez creado el admin, ponemos al servidor escuchar peticiones http e imprimimos un mensaje en la consola
    aplicacionServidor.listen(puerto, () => {
        console.log(`Servidor escuchando en http://localhost:${puerto}`);
    });
});
