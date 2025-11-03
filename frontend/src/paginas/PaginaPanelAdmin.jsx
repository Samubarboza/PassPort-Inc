import React, { useEffect, useState } from 'react';
import { usarAutenticacion } from '../contexto/contextoAutenticacion.jsx';

export default function PaginaPanelAdmin() {
    const { tokenJWEEnMemoria } = usarAutenticacion();
    const [respuesta, setRespuesta] = useState(null);
    const [tokenCSRF, setTokenCSRF] = useState('');
    const urlBase = 'http://localhost:4000';
    
    useEffect(() => {
        fetch(`${urlBase}/auth/csrf-token`, { credentials:'include' })
        .then(r=>r.json()).then(j=>setTokenCSRF(j.data.tokenCSRFParaFormulario));
    },[]);
    
    async function ejecutarAccionAdministrativa(){
        if (tokenJWEEnMemoria) {
            const r = await fetch(`${urlBase}/privado/solo-admin-jwt`, {
                method:'POST', headers:{ Authorization:`Bearer ${tokenJWEEnMemoria}` }
            });
            setRespuesta(await r.json());
        } else {
            const r = await fetch(`${urlBase}/privado/solo-admin-sesion`, {
                method:'POST',
                headers:{ 'x-csrf-token': tokenCSRF },
                credentials:'include'
            });
            setRespuesta(await r.json());
        }
    }
    
    return (
    <div>
        <h2>Acción administrativa</h2>
        <button onClick={ejecutarAccionAdministrativa}>Ejecutar</button>
        <pre>{JSON.stringify(respuesta, null, 2)}</pre>
    </div>
    );
}
