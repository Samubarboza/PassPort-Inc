import { CompactEncrypt, compactDecrypt } from 'jose';
import { createSecretKey } from 'node:crypto';

const claveJWE = createSecretKey(
    Buffer.from(process.env.CLAVE_SECRETA_JWE, 'utf8')
);

export async function emitirTokenJWE({ idUsuario, rolUsuario }) {
    const cargaUtil = new TextEncoder().encode(JSON.stringify({
        idUsuario,
        rolUsuario,
        emitidoEnISO: new Date().toISOString()
    }));
    
    const jwe = await new CompactEncrypt(cargaUtil)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ: 'JWT' })
    .encrypt(claveJWE);
    return jwe;
}

export async function verificarTokenJWE(tokenJwe) {
    const { plaintext } = await compactDecrypt(tokenJwe, claveJWE);
    return JSON.parse(new TextDecoder().decode(plaintext));
}
