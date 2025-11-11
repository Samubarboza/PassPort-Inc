import React, { createContext, useContext, useState, useEffect } from 'react';

const ContextoAutenticacion = createContext();

export function ProveedorAutenticacion({ children }) {
    const [tokenJWEEnMemoria, setTokenJWEEnMemoria] = useState(null);
    const [perfilSesion, setPerfilSesion] = useState(null);

  // Al montar la app, verificar si hay sesión activa
useEffect(() => {
    fetch('http://localhost:4000/privado/verificar-sesion', {
        credentials: 'include'
    })
    .then(r => r.json())
    .then(j => {
        if (j.ok) {
            setPerfilSesion({
                idUsuario: j.data.idUsuario,
                rolUsuario: j.data.rolUsuario
            });
        }
    })
    .catch(() => {});
}, []);

const valor = { tokenJWEEnMemoria, setTokenJWEEnMemoria, perfilSesion, setPerfilSesion };
return <ContextoAutenticacion.Provider value={valor}>{children}</ContextoAutenticacion.Provider>;
}

export function usarAutenticacion() {
    return useContext(ContextoAutenticacion);
}
