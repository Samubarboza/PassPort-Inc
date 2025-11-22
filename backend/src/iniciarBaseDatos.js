import { conexionBaseDatos } from './database/conexionBaseDatos.js';
import bcrypt from 'bcrypt';

// funcion que crea el usuario administrador en la base de datos
export async function crearAdministradorPorDefectoSiNoExiste() {
    const existe = conexionBaseDatos.prepare(
        `SELECT id 
        FROM usuarios 
        WHERE correoElectronico = ?`
    ).get('admin@passport.inc');
    if (!existe) {
        const hashContrasena = await bcrypt.hash('AdminSeguro#123', 12);
        console.log(hashContrasena)
        console.log(existe);
        conexionBaseDatos.prepare(`
            INSERT INTO usuarios (correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO)
            VALUES (@correoElectronico, @hashContrasena, @rolUsuario, @fechaCreacionISO) -- bindings nombrados
            `).run({
                // estructura de datos de tipo objeto que guarda pares de clave valor
                correoElectronico: 'admin@passport.inc',
                hashContrasena,
                rolUsuario: 'Administrador',
                fechaCreacionISO: new Date().toISOString()
            });
        }
    }
