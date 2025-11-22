import { conexionBaseDatos } from '../database/conexionBaseDatos.js';

export const modeloUsuario = {
    // este primer metodo recibe un parametro (objeto) de tres propiedades -  pasamos los datos por bindings nombrados
    crearUsuarioConHash({ correoElectronico, hashContrasena, rolUsuario }) {
        const fechaCreacionISO = new Date().toISOString();
        const consultaUsuario = conexionBaseDatos.prepare(`
            INSERT INTO usuarios (correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO)
            VALUES (@correoElectronico, @hashContrasena, @rolUsuario, @fechaCreacionISO) -- bindings, tratamos los datos que llega por parte del usuario como dato para meter la informacion a la base de datos
        `);

            const info = consultaUsuario.run({ correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO });
            return { id: info.lastInsertRowid, correoElectronico, rolUsuario, fechaCreacionISO };
    },
        // este metodo consulta la base para ver si existe un usuario con ese correo - pasamos los datos por bindings posicion
        buscarUsuarioPorCorreo(correoElectronico) {
            return conexionBaseDatos.prepare(`
                SELECT id, correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO
                FROM usuarios WHERE correoElectronico = ? -- binding posicional
            `).get(correoElectronico);
        },
            
            buscarUsuarioPorId(idUsuario) {
                return conexionBaseDatos.prepare(`
                    SELECT id, correoElectronico, rolUsuario 
                    FROM usuarios WHERE id = ? -- binding posicional 
                `).get(idUsuario);
            }
};
