import React, { useEffect, useState } from 'react';

export default function PaginaRegistro() {
    const [tokenCSRF, setTokenCSRF] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [contrasenaPlano, setContrasenaPlano] = useState('');
    const urlBase = 'http://localhost:4000';
    
    useEffect(() => {
        fetch(`${urlBase}/auth/csrf-token`, { credentials:'include' })
        .then(r=>r.json()).then(j=>setTokenCSRF(j.data.tokenCSRFParaFormulario));
    },[]);
    
    async function manejarEnvioRegistro(e){
        e.preventDefault();
        const res = await fetch(`${urlBase}/auth/registro`, {
            method:'POST',
            headers:{ 'Content-Type':'application/json', 'x-csrf-token': tokenCSRF },
            credentials:'include',
            body: JSON.stringify({ correoElectronico, contrasenaPlano })
        });
        alert(JSON.stringify(await res.json()));
    }
    
    return (
    <form onSubmit={manejarEnvioRegistro}>
        <h2>Registro</h2>
        <input placeholder="Correo" value={correoElectronico} onChange={e=>setCorreoElectronico(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={contrasenaPlano} onChange={e=>setContrasenaPlano(e.target.value)} />
        <button>Crear cuenta</button>
    </form>
    );
}
