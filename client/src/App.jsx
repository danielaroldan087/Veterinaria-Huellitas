
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/Login";
import RecuperarPassword from "./pages/RecuperarPassword";
import ModuloAdministrador from "./pages/administrador/ModuloAdministrador";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import PerfilRecepcion from "./pages/PerfilRecepcion";
import CambiarPasswordRecepcion from "./pages/CambiarPasswordRecepcion";
import InicioRecepcion from "./pages/InicioRecepcion";
import PropietariosRecepcion from "./pages/PropietariosRecepcion";
import RegistrarPropietarioRecepcion from "./pages/RegistrarPropietarioRecepcion";
import MascotasRecepcion from "./pages/MascotasRecepcion";
import RegistrarMascotaRecepcion from "./pages/RegistrarMascotaRecepcion";
import AgendaRecepcion from "./pages/AgendaRecepcion";
import ProgramarCitaRecepcion from "./pages/ProgramarCitaRecepcion";
import ModificarCancelarCitaRecepcion from "./pages/ModificarCancelarCitaRecepcion";
import BuscadorGeneralRecepcion from "./pages/BuscadorGeneralRecepcion";

import { InicioVeterinario, AgendaVeterinario, PacientesVeterinario, FichaVeterinario, HistorialVeterinario, AtencionesVeterinario, NuevaAtencion, DiagnosticoVeterinario, InformesVeterinario, NuevoInforme, VerInforme } from "./pages/veterinario/ModuloVeterinario";
import "./App.css";

const rutasPorRol = {
  administrador: "/administrador",
  recepcionista: "/recepcionista",
  veterinario: "/veterinario"
};

function Inicio() {
  const { autenticado, usuario } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={rutasPorRol[usuario.rol] || "/no-autorizado"}
      replace
    />
  );
}

function NoAutorizado() {
  return (
    <main className="mensaje-pagina">
      <h1>Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta sección.</p>
      <Inicio />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />

        <Route path="/login" element={<Login />} />

        <Route path="/recuperar-password" element={<RecuperarPassword />} />

        <Route element={<ProtectedRoute rolesPermitidos={["administrador"]} />}>
          <Route path="/administrador/*" element={<ModuloAdministrador />} />
        </Route>

        <Route element={<ProtectedRoute rolesPermitidos={["recepcionista"]} />}>
          <Route path="/recepcionista" element={<InicioRecepcion />} />
          <Route path="/recepcionista/perfil" element={<PerfilRecepcion />} />
          <Route path="/recepcionista/inicio" element={<InicioRecepcion />} />
          <Route path="/recepcionista/cambiar-password" element={<CambiarPasswordRecepcion />} />
          <Route path="/recepcionista/propietarios" element={<PropietariosRecepcion />} />
          <Route path="/recepcionista/propietarios/nuevo" element={<RegistrarPropietarioRecepcion />} />
          <Route path="/recepcionista/mascotas" element={<MascotasRecepcion />} />
          <Route path="/recepcionista/mascotas/nueva" element={<RegistrarMascotaRecepcion />} />
          <Route path="/recepcionista/agenda" element={<AgendaRecepcion />} />
          <Route path="/recepcionista/agenda/nueva" element={<ProgramarCitaRecepcion />} />
          <Route path="/recepcionista/agenda/gestionar" element={<ModificarCancelarCitaRecepcion />} />
          <Route path="/recepcionista/buscador" element={<BuscadorGeneralRecepcion />} />
        </Route>

        <Route element={<ProtectedRoute rolesPermitidos={["veterinario"]} />}>
          <Route path="/veterinario" element={<InicioVeterinario />} />
          <Route path="/veterinario/agenda" element={<AgendaVeterinario />} />
          <Route path="/veterinario/pacientes" element={<PacientesVeterinario />} />
          <Route path="/veterinario/pacientes/:id" element={<FichaVeterinario />} />
          <Route path="/veterinario/historial" element={<PacientesVeterinario historial />} />
          <Route path="/veterinario/historial/:id" element={<HistorialVeterinario />} />
          <Route path="/veterinario/atenciones" element={<AtencionesVeterinario />} />
          <Route path="/veterinario/atenciones/nueva" element={<NuevaAtencion />} />
          <Route path="/veterinario/atenciones/:id/diagnostico" element={<DiagnosticoVeterinario />} />
          <Route path="/veterinario/informes" element={<InformesVeterinario />} />
          <Route path="/veterinario/informes/nuevo" element={<NuevoInforme />} />
          <Route path="/veterinario/informes/:id" element={<VerInforme />} />
        </Route>

        <Route path="/no-autorizado" element={
          <main className="mensaje-pagina">
            <h1>Acceso no autorizado</h1>
            <p>No tienes permisos para acceder a esta sección.</p>
          </main>
        } />

        <Route path="*" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}
