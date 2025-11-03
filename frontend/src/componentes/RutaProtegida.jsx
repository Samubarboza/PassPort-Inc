import React from 'react';
import { usarAutenticacion } from '../contexto/contextoAutenticacion.jsx';

export default function RutaProtegida({ children, requerirRol }) {
    const { tokenJWEEnMemoria, perfilSesion } = usarAutenticacion();
    const rolActual = perfilSesion?.rolUsuario ?? null;
    const tieneJWT = Boolean(tokenJWEEnMemoria);
    
    if (!tieneJWT && !rolActual) return <p>Acceso denegado: Inicie sesión.</p>;
    if (requerirRol && requerirRol !== (rolActual ?? 'Usuario')) return <p>Acceso restringido por rol.</p>;
    return children;
}
