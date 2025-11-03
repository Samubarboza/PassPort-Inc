import React, { useEffect, useState } from 'react';
import { usarAutenticacion } from '../contexto/contextoAutenticacion.jsx';

export default function PaginaPanelUsuario() {
    const { tokenJWEEnMemoria } = usarAutenticacion();
    const [perfil, setPerfil] = useState(null);
    const urlBase = 'http://localhost:4000';
    
    useEffect(() => {
        const pedir = async () => {
            if (tokenJWEEnMemoria) {
                const r = await fetch(`${urlBase}/privado/perfil-jwt`, {
                    headers: { Authorization: `Bearer ${tokenJWEEnMemoria}` }
                });
                setPerfil((await r.json()).data);
            } else {
                const r = await fetch(`${urlBase}/privado/perfil-sesion`, { credentials:'include' });
                setPerfil((await r.json()).data);
            }
        };
        pedir();
    }, [tokenJWEEnMemoria]);
    
    return <pre>{JSON.stringify(perfil, null, 2)}</pre>;
}
