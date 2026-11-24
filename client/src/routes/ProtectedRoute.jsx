
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ rolesPermitidos }) {
  const { autenticado, usuario } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (
    rolesPermitidos &&
    !rolesPermitidos.includes(usuario.rol)
  ) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
}
