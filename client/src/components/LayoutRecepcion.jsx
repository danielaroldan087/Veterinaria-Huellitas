import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LayoutRecepcion.css";

export default function LayoutRecepcion({
  breadcrumb,
  titulo,
  subtitulo,
  seccionActivaInicial = "perfil",
  onSeleccionarSeccion,
  children
}) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const nombreUsuario = usuario?.nombre || "Sofía Ramírez";
  const sedeAsignada = usuario?.sede || "Miraflores";

  const [seccionLateral, setSeccionLateral] = useState(seccionActivaInicial);

  function manejarClickSeccion(id) {
    setSeccionLateral(id);
    if (onSeleccionarSeccion) {
      onSeleccionarSeccion(id);
    }
    if (id === "inicio") {
    navigate("/recepcionista/inicio");
    }
    if (id === "propietarios") {
    navigate("/recepcionista/propietarios");
    }
    if (id === "mascotas") {
    navigate("/recepcionista/mascotas");
    }
    if (id === "agenda") {
    navigate("/recepcionista/agenda");
    }
    if (id === "buscador") {
    navigate("/recepcionista/buscador");
    }
  }

  function manejarCerrarSesion() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="recep-shell">
      <aside className="recep-sidebar" aria-label="Navegación de recepción">
        <div className="recep-sidebar-top">
          <div className="recep-brand">
            <div className="recep-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="7" cy="8" r="2" />
                <circle cx="12" cy="6" r="2" />
                <circle cx="17" cy="8" r="2" />
                <path d="M12 11.5c-3.2 0-5.5 2.1-5.5 4.7 0 1.8 1.5 2.8 3.2 2.8 1 0 1.6-.4 2.3-.4.7 0 1.3.4 2.3.4 1.7 0 3.2-1 3.2-2.8 0-2.6-2.3-4.7-5.5-4.7z" />
              </svg>
            </div>
            <div className="recep-brand-text">
              <span className="recep-brand-name">Huellitas de Amor</span>
              <span className="recep-brand-sub">CLÍNICA VETERINARIA</span>
            </div>
          </div>

          <p className="recep-nav-section">ESPACIO DE RECEPCIÓN</p>

          <nav className="recep-nav-list">
            {[
              { id: "inicio", label: "Inicio" },
              { id: "propietarios", label: "Propietarios" },
              { id: "mascotas", label: "Mascotas" },
              { id: "agenda", label: "Agenda" },
              { id: "buscador", label: "Buscador general" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`recep-nav-item ${seccionLateral === item.id ? "is-active" : ""}`}
                onClick={() => manejarClickSeccion(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="recep-sidebar-bottom">
          <button
            type="button"
            className={`recep-profile-link ${seccionLateral === "perfil" ? "is-active" : ""}`}
            onClick={() => {
              manejarClickSeccion("perfil");
              navigate("/recepcionista");
            }}
          >
            Mi perfil y seguridad
          </button>

          <div className="recep-user-footer">
            <div className="recep-user-name">{nombreUsuario}</div>
            <div className="recep-user-meta">
              <span>Recepción</span>
              <span>·</span>
              <button
                type="button"
                className="recep-logout-inline"
                onClick={manejarCerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="recep-main-area">
        <header className="recep-topbar">
          <div className="recep-context">
            <strong>Sede {sedeAsignada}</strong>
            <span>/</span>
            <span>Recepción</span>
          </div>

          <div className="recep-topbar-right">
            <span className="recep-date">Lunes, 26 de octubre de 2026</span>
            <button
              type="button"
              className="recep-icon-btn"
              aria-label="Buscar en el sistema"
              onClick={() => manejarClickSeccion("buscador")}
            >
              🔍
            </button>
            <button
              type="button"
              className="recep-icon-btn"
              aria-label="Notificaciones"
            >
              🔔
            </button>
          </div>
        </header>

        <main className="recep-content">
          {breadcrumb && <div className="recep-breadcrumb">{breadcrumb}</div>}

          {(titulo || subtitulo) && (
            <div className="recep-page-header">
              {titulo && <h1>{titulo}</h1>}
              {subtitulo && <p>{subtitulo}</p>}
            </div>
          )}

          {children}

          <footer className="recep-footer">
            <span>Huellitas de Amor · Gestión clínica</span>
            <span>Conexión segura · Sincronizado a las 09:12</span>
          </footer>
        </main>
      </div>
    </div>
  );
}