export function limpiarTextoPotencialmentePeligroso(entrada) {
    return String(entrada ?? '') // si la entrada es null o undefined usamos '' texto vacio
    .replaceAll('&','&amp;') // converte & a %amp para evitar codigo html malicioso
    .replaceAll('<','&lt;') // los navegadores interpretan esos simbolos como codigo, reemplazamos por la version segura para evitar errores y ataques XSS
    .replaceAll('>','&gt;')
    .trim(); // sacamos espacios del inicio y del final
    // esta configuracion no afecta al usuario normal, solo a alguien que quiere atacar
}

// esta funcion recibe 1 parametro (objeto) de dos propiedades
export function validarCorreoYContrasena({ correoElectronico, contrasenaPlano }) {
    const correoSanitizado = limpiarTextoPotencialmentePeligroso(correoElectronico);
    // esto garantiza que la contraseña siempre sea un texto limpio sin espacios ni valores nulos
    const contrasenaSanitizada = String(contrasenaPlano ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoSanitizado)) throw new Error('correo invalido');
    if (contrasenaSanitizada.length < 8) throw new Error('contraseña muy corta');
    return { correoSanitizado, contrasenaSanitizada };
}
