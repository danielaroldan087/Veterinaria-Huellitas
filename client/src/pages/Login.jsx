
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const rutasPorRol = {
  administrador: "/administrador",
  recepcionista: "/recepcionista",
  veterinario: "/veterinario"
};

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login, usuario, autenticado } = useAuth();
  const navigate = useNavigate();

  if (autenticado) {
    return (
      <Navigate
        to={rutasPorRol[usuario.rol] || "/no-autorizado"}
        replace
      />
    );
  }

  async function manejarLogin(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);

    try {
      const usuarioAutenticado = await login(correo, password);

      const destino = rutasPorRol[usuarioAutenticado.rol];

      navigate(destino || "/no-autorizado", {
        replace: true
      });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-container">
      <form className="login-form" onSubmit={manejarLogin}>
        <h1>Huellitas de Amor</h1>
        <p>Sistema de gestión veterinaria</p>

        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p role="alert" className="login-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}
