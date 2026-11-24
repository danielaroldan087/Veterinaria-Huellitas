
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nombresRoles = {
  administrador: "Administrador",
  recepcionista: "Recepcionista",
  veterinario: "Veterinario"
};

export default function Panel() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="panel-container">
      <header className="panel-header">
        <div>
          <h1>Veterinaria Huellitas de Amor</h1>
          <p>Bienvenido, {usuario.nombre}</p>
        </div>

        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <section className="panel-content">
        <h2>
          Panel de {nombresRoles[usuario.rol] || usuario.rol}
        </h2>

        <p>
          Has iniciado sesión correctamente.
        </p>

        <p>
          Correo: {usuario.correo || "No disponible"}
        </p>

        <p>
          Aquí integraremos las interfaces de Figma
          correspondientes a tu rol.
        </p>
      </section>
    </main>
  );
}
