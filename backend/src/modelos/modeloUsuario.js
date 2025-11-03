import { conexionBaseDatos } from '../baseDatos/conexionBaseDatos.js';

export const modeloUsuario = {
    crearUsuarioConHash({ correoElectronico, hashContrasena, rolUsuario }) {
        const fechaCreacionISO = new Date().toISOString();
        const stmt = conexionBaseDatos.prepare(`
            INSERT INTO usuarios (correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO)
            VALUES (@correoElectronico, @hashContrasena, @rolUsuario, @fechaCreacionISO)
            `);
            const info = stmt.run({ correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO });
            return { id: info.lastInsertRowid, correoElectronico, rolUsuario, fechaCreacionISO };
        },
        
        buscarUsuarioPorCorreo(correoElectronico) {
            return conexionBaseDatos.prepare(`
                SELECT id, correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO
                FROM usuarios WHERE correoElectronico = ?
                `).get(correoElectronico);
            },
            
            buscarUsuarioPorId(idUsuario) {
                return conexionBaseDatos.prepare(`
                    SELECT id, correoElectronico, rolUsuario FROM usuarios WHERE id = ?
                    `).get(idUsuario);
                }
};
