export function limpiarTextoPotencialmentePeligroso(entrada) {
    return String(entrada ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .trim();
}

// esta funcion recibe 1 parametro (objeto) de dos propiedades
export function validarCorreoYContrasena({ correoElectronico, contrasenaPlano }) {
    const correoSanitizado = limpiarTextoPotencialmentePeligroso(correoElectronico);
    const contrasenaSanitizada = String(contrasenaPlano ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoSanitizado)) throw new Error('correo invalido');
    if (contrasenaSanitizada.length < 8) throw new Error('contraseña muy corta');
    return { correoSanitizado, contrasenaSanitizada };
}
