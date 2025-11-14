import { conexionBaseDatos } from '../database/conexionBaseDatos.js';

// modelo usuario es un objeto donde obtenemos datos de metodos - hacemos de esta manera para agrupar funciones que trabajan sobre la misma cosa
export const modeloUsuario = {
    // este primer metodo recibe un parametro (objeto) de tres propiedades
    crearUsuarioConHash({ correoElectronico, hashContrasena, rolUsuario }) {
        const fechaCreacionISO = new Date().toISOString();
        const stmt = conexionBaseDatos.prepare(`
            INSERT INTO usuarios (correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO)
            VALUES (@correoElectronico, @hashContrasena, @rolUsuario, @fechaCreacionISO)
            `);
            // cuando recibe el dato lo que hacemos es ejecutar la consulta -  run devuelve un objeto con datos del resultado y eso guardamos en esta variable info
            const info = stmt.run({ correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO });
            // este metodo retorna, el id, el correo que recibimos como parametro, el rol y la fecha - solo el id viene de info
            return { id: info.lastInsertRowid, correoElectronico, rolUsuario, fechaCreacionISO };
        },
        // este metodo solamente consulta la base para ver si existe un usuario con ese correo
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
