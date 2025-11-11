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
    <form
        onSubmit={manejarEnvioRegistro}
        className="mx-auto mt-16 w-full max-w-sm rounded-2xl border border-blue-700/60 bg-[#0d1b2a]/70 p-6 shadow-2xl backdrop-blur-lg hover:shadow-blue-800/40 transition will-change-transform">
        
        <h2 className="mb-6 text-center text-2xl font-extrabold tracking-wide text-blue-300 drop-shadow-[0_0_10px_#2563eb">Registro</h2>

        <input
            placeholder="Correo"
            value={correoElectronico}
            onChange={e=>setCorreoElectronico(e.target.value)}
            className="mb-4 w-full rounded-md border border-blue-700/60 bg-[#1b263b] p-2 text-blue-100 placeholder-blue-400 outline-none focus:ring-2 focus:ring-blue-500"/>

        <input placeholder="Contraseña" type="password" value={contrasenaPlano} onChange={e=>setContrasenaPlano(e.target.value)} className="mb-6 w-full rounded-md border border-blue-700/60 bg-[#1b263b] p-2 text-blue-100 placeholder-blue-400 outline-none focus:ring-2 focus:ring-blue-500"/>
        
        <button className="w-full rounded-md bg-gradient-to-r from-[#001a44] via-[#003b8e] to-[#005eff] py-2 font-semibold text-white shadow-[0_0_10px_rgba(0,80,255,0.4)] hover:shadow-[0_0_20px_rgba(0,120,255,0.6)] hover:scale-[1.02] transition-all duration-300">Crear cuenta</button>

    </form>
    );
}
