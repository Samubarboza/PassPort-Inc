import { conexionBaseDatos } from './baseDatos/conexionBaseDatos.js';
import bcrypt from 'bcrypt';

export async function crearAdministradorPorDefectoSiNoExiste() {
    const existe = conexionBaseDatos.prepare(
        `SELECT id FROM usuarios WHERE correoElectronico = ?`
    ).get('admin@passport.inc');
    
    if (!existe) {
        const hashContrasena = await bcrypt.hash('AdminSeguro#123', 12);
        conexionBaseDatos.prepare(`
            INSERT INTO usuarios (correoElectronico, hashContrasena, rolUsuario, fechaCreacionISO)
            VALUES (@correoElectronico, @hashContrasena, @rolUsuario, @fechaCreacionISO)
            `).run({
                correoElectronico: 'admin@passport.inc',
                hashContrasena,
                rolUsuario: 'Administrador',
                fechaCreacionISO: new Date().toISOString()
            });
        }
    }
