import { conexionBaseDatos } from './database/conexionBaseDatos.js';
import bcrypt from 'bcrypt';

export async function crearAdministradorPorDefectoSiNoExiste() {
    // creamos una variable y va a contener la consulta sql - preparaos la consutla
    const existe = conexionBaseDatos.prepare(
        `SELECT id FROM usuarios WHERE correoElectronico = ?`
    ).get('admin@passport.inc'); // con get ejecutamos la consulta, le pasamos el argumento para la consulta, si no existe usuario con este correo, el valor de esta variable seria undefined
    if (!existe) {
        // le pasamos la contraseña original - 12 es las veces que se mezcla y recalcula el hash. esto para no guardar la contraseña en texto plano
        const hashContrasena = await bcrypt.hash('AdminSeguro#123', 12);
        console.log(hashContrasena)
        console.log(existe);
        conexionBaseDatos.prepare(`
            INSERT INTO usuarios (correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO)
            VALUES (@correoElectronico, @hashContrasena, @rolUsuario, @fechaCreacionISO)
            `).run({ // los @ son valores que se reemplazan por las variables que le pasamos- con run ejecutamos la consulta
                // estructura de datos de tipo objeto que guarda pares de clave valor
                correoElectronico: 'admin@passport.inc',
                hashContrasena,
                rolUsuario: 'Administrador',
                fechaCreacionISO: new Date().toISOString()
            });
        }
    }
