export function permitirSoloRoles(listaRolesPermitidos) {
    return (req, res, next) => {
        const rol = req?.usuarioAutenticado?.rolUsuario || req?.datosTokenJWE?.rolUsuario;
        if (!rol || !listaRolesPermitidos.includes(rol)) {
            return res.status(403).json({ ok:false, mensaje:'permisoDenegado' });
        }
        next();
    };
}
