import React, { createContext, useContext, useState } from 'react';

const ContextoAutenticacion = createContext();

export function ProveedorAutenticacion({ children }) {
    const [tokenJWEEnMemoria, setTokenJWEEnMemoria] = useState(null);
    const [perfilSesion, setPerfilSesion] = useState(null);
    
    const valor = { tokenJWEEnMemoria, setTokenJWEEnMemoria, perfilSesion, setPerfilSesion };
    return <ContextoAutenticacion.Provider value={valor}>{children}</ContextoAutenticacion.Provider>;
}
export function usarAutenticacion(){ return useContext(ContextoAutenticacion); }
