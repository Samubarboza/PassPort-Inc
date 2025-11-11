import React from 'react';
import { ProveedorAutenticacion } from './contexto/contextoAutenticacion.jsx';
import PaginaRegistro from './paginas/PaginaRegistro.jsx';
import PaginaInicioSesion from './paginas/PaginaInicioSesion.jsx';
import PaginaPanelUsuario from './paginas/PaginaPanelUsuario.jsx';
import PaginaPanelAdmin from './paginas/PaginaPanelAdmin.jsx';
import RutaProtegida from './componentes/RutaProtegida.jsx';

export default function App() {
  return (
    <ProveedorAutenticacion>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#020617] via-[#001133] to-[#0a0a23] text-white">
        
        <h1 className="text-3xl font-bold mb-10 text-blue-300 drop-shadow-[0_0_10px_#2563eb]">
          PassPort Inc.
        </h1>

        {/* CONTENEDOR: registro + inicio de sesión lado a lado */}
        <div className="flex flex-col md:flex-row gap-16 p-10 rounded-3xl bg-[#0d1b2a]/60 backdrop-blur-lg shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <PaginaRegistro />
          <PaginaInicioSesion />
        </div>

        {/* PANEL DE USUARIO Y ADMIN (ocultos tras login) */}
        <div className="mt-20 w-full max-w-4xl text-center space-y-12">
          <RutaProtegida>
            <PaginaPanelUsuario />
          </RutaProtegida>

          <RutaProtegida requerirRol="Administrador">
            <PaginaPanelAdmin />
          </RutaProtegida>
        </div>
      </div>
    </ProveedorAutenticacion>
  );
}
