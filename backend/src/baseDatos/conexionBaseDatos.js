import Database from 'better-sqlite3';
const conexionBaseDatos = new Database('passPortInc.db');

conexionBaseDatos.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    correoElectronico TEXT UNIQUE NOT NULL,
    hashContrasena TEXT NOT NULL,
    rolUsuario TEXT NOT NULL CHECK(rolUsuario IN ('Usuario','Administrador')),
    fechaCreacionISO TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS sesiones (
    idSesion TEXT PRIMARY KEY,
    idUsuario INTEGER NOT NULL,
    expiraEnEpoch INTEGER NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id) ON DELETE CASCADE
    );
`);
export { conexionBaseDatos };
