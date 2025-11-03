export function limpiarTextoPotencialmentePeligroso(entrada) {
    return String(entrada ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .trim();
}

export function validarCorreoYContrasena({ correoElectronico, contrasenaPlano }) {
    const correoSanitizado = limpiarTextoPotencialmentePeligroso(correoElectronico);
    const contrasenaSanitizada = String(contrasenaPlano ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoSanitizado)) throw new Error('correoInvalido');
    if (contrasenaSanitizada.length < 8) throw new Error('contrasenaMuyCorta');
    return { correoSanitizado, contrasenaSanitizada };
}
