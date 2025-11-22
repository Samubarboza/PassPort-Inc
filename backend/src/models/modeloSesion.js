import { conexionBaseDatos } from '../database/conexionBaseDatos.js';
import crypto from 'node:crypto';

// objeto que agrupa metodos que trabajan con la tabla
export const modeloSesion = {
    crearSesionParaUsuario(idUsuario, minutosDuracion) {
        const idSesion = crypto.randomUUID(); // genera un id unico de sesion - este valor se guarda en la cookie
        const tiempoActualEnSegundos = Math.floor(Date.now() / 1000); // date.now da el tiempo actual en milisegundos / dividimos por 1000 para pasar a seg - math floor redondea hacia abajo para que quede como un entero - resultado, da el tiempo actual en formato epoch
        const expiraEnEpoch = tiempoActualEnSegundos + minutosDuracion * 60;
        
        conexionBaseDatos.prepare(`
            INSERT INTO sesiones (idSesion, idUsuario, expiraEnEpoch)
            VALUES (@idSesion, @idUsuario, @expiraEnEpoch)
            `).run({ idSesion, idUsuario, expiraEnEpoch });
            return { idSesion, expiraEnEpoch };
    },
    // metodo que recibe un idSesion desde la cookie del usuario
    obtenerSesionValida(idSesion) {
        const tiempoActualEnSegundos = Math.floor(Date.now() / 1000);
        const sesion = conexionBaseDatos.prepare(`
            SELECT idSesion, idUsuario, expiraEnEpoch
            FROM sesiones
            WHERE idSesion = ?
            `).get(idSesion);
            
            if (!sesion || sesion.expiraEnEpoch < tiempoActualEnSegundos) return null;
            return sesion;
    },
    
    // metodo que elimina sesion de la base de datos
    eliminarSesion(idSesion) {
        conexionBaseDatos.prepare(`DELETE FROM sesiones WHERE idSesion = ?`).run(idSesion);
    },
    
    // metodo que busca la sesion de la base de datos
    buscarSesionPorId(idSesion) {
        const consultaSesion = conexionBaseDatos.prepare(
            `SELECT idSesion, idUsuario, expiraEnEpoch 
            FROM sesiones 
            WHERE idSesion = ?`
        );
        
        const sesion = consultaSesion.get(idSesion);
        return sesion || null;
    }
};
