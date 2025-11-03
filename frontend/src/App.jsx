import React from 'react';
import { ProveedorAutenticacion } from './contexto/contextoAutenticacion.jsx';
import PaginaRegistro from './paginas/PaginaRegistro.jsx';
import PaginaInicioSesion from './paginas/PaginaInicioSesion.jsx';
import PaginaPanelUsuario from './paginas/PaginaPanelUsuario.jsx';
import PaginaPanelAdmin from './paginas/PaginaPanelAdmin.jsx';
import RutaProtegida from './componentes/RutaProtegida.jsx';

export default function App(){
  return (
    <ProveedorAutenticacion>
      <h1>PassPort Inc. (demo mínima)</h1>
      <PaginaRegistro />
      <hr/>
      <PaginaInicioSesion />
      <hr/>
      <RutaProtegida><PaginaPanelUsuario /></RutaProtegida>
      <hr/>
      <RutaProtegida requerirRol="Administrador"><PaginaPanelAdmin /></RutaProtegida>
    </ProveedorAutenticacion>
  );
}
