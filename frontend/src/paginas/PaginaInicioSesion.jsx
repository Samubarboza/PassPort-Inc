import React, { useEffect, useState } from 'react';
import { usarAutenticacion } from '../contexto/contextoAutenticacion.jsx';

export default function PaginaInicioSesion() {
    const { setTokenJWEEnMemoria, setPerfilSesion } = usarAutenticacion();
    const [tokenCSRF, setTokenCSRF] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [contrasenaPlano, setContrasenaPlano] = useState('');
    const [usarJWT, setUsarJWT] = useState(false);
    const urlBase = 'http://localhost:4000';
    
    useEffect(() => {
        fetch(`${urlBase}/auth/csrf-token`, { credentials:'include' })
        .then(r=>r.json()).then(j=>setTokenCSRF(j.data.tokenCSRFParaFormulario));
    },[]);
    
    async function manejarInicioSesion(e){
        e.preventDefault();
        const res = await fetch(`${urlBase}/auth/inicio-sesion`, {
            method:'POST',
            headers:{ 'Content-Type':'application/json', 'x-csrf-token': tokenCSRF },
            credentials:'include',
            body: JSON.stringify({ correoElectronico, contrasenaPlano, preferirJWT: usarJWT })
        });
        const j = await res.json();
        if (usarJWT && j.ok) setTokenJWEEnMemoria(j.data.tokenJWE);
        if (!usarJWT && j.ok) setPerfilSesion({ rolUsuario: j.data.rolUsuario, idUsuario: j.data.idUsuario });
        alert(JSON.stringify(j));
    }
    
    return (
    <form onSubmit={manejarInicioSesion}>
        <h2>Inicio de sesión</h2>
        <label><input type="checkbox" checked={usarJWT} onChange={e=>setUsarJWT(e.target.checked)} /> Usar JWT cifrado</label>
        <input placeholder="Correo" value={correoElectronico} onChange={e=>setCorreoElectronico(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={contrasenaPlano} onChange={e=>setContrasenaPlano(e.target.value)} />
        <button>Ingresar</button>
    </form>
    );
}
