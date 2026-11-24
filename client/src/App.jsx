
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/Login";
import Panel from "./pages/Panel";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

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

        <Route element={<ProtectedRoute rolesPermitidos={["administrador"]} />}>
          <Route path="/administrador" element={<Panel />} />
        </Route>

        <Route element={<ProtectedRoute rolesPermitidos={["recepcionista"]} />}>
          <Route path="/recepcionista" element={<Panel />} />
        </Route>

        <Route element={<ProtectedRoute rolesPermitidos={["veterinario"]} />}>
          <Route path="/veterinario" element={<Panel />} />
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
