import { CompactEncrypt, compactDecrypt } from 'jose';
import { createSecretKey } from 'node:crypto';

const claveJWE = createSecretKey(
    // buffer, convertimos el texto hexa en bytes dentro del buffer
    Buffer.from(process.env.CLAVE_SECRETA_JWE, 'hex') 
);

// esta funcion arma y encripta un token jwt -  el token es lo que guardamos en la cookie y sirve como identidad cifrada
export async function emitirTokenJWE({ idUsuario, rolUsuario }) {
    const bytesDelUsuarioParaJWE = new TextEncoder().encode(JSON.stringify({
        idUsuario,
        rolUsuario,
        emitidoEnISO: new Date().toISOString()
    }));

    // creamos un encriptador y metemos adentro los bytes generados para cifrar - compactEncrypt sirve para construir un token JWT
    const jwe = await new CompactEncrypt(bytesDelUsuarioParaJWE)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ: 'JWT' })
        .encrypt(claveJWE);


    return jwe;
}
// funcion asincrona que verifica el jwt - desencripta 
export async function verificarTokenJWE(tokenJwe) {
    const { plaintext } = await compactDecrypt(tokenJwe, claveJWE);
    return JSON.parse(new TextDecoder().decode(plaintext));
}
