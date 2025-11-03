import { conexionBaseDatos } from '../baseDatos/conexionBaseDatos.js';
import crypto from 'node:crypto';

export const modeloSesion = {
    crearSesionParaUsuario(idUsuario, minutosDuracion) {
        const idSesion = crypto.randomUUID();
        const ahora = Math.floor(Date.now() / 1000);
        const expiraEnEpoch = ahora + minutosDuracion * 60;
        conexionBaseDatos.prepare(`
            INSERT INTO sesiones (idSesion, idUsuario, expiraEnEpoch)
            VALUES (@idSesion, @idUsuario, @expiraEnEpoch)
            `).run({ idSesion, idUsuario, expiraEnEpoch });
            return { idSesion, expiraEnEpoch };
    },
    
    obtenerSesionValida(idSesion) {
        const ahora = Math.floor(Date.now() / 1000);
        const sesion = conexionBaseDatos.prepare(`
            SELECT idSesion, idUsuario, expiraEnEpoch FROM sesiones WHERE idSesion = ?
        `).get(idSesion);
        
        if (!sesion || sesion.expiraEnEpoch < ahora) return null;
        return sesion;
    },
    
    eliminarSesion(idSesion) {
        conexionBaseDatos.prepare(`DELETE FROM sesiones WHERE idSesion = ?`).run(idSesion);
    }
};
