import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginVeterinariaImg from "../assets/LoginVeterinaria.png";
import "./Login.css";

const rutasPorRol = {
  administrador: "/administrador",
  recepcionista: "/recepcionista",
  veterinario: "/veterinario",
};

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState("");
  const [avisoRecuperacion, setAvisoRecuperacion] = useState("");
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
    setAvisoRecuperacion("");
    setCargando(true);

    try {
      const usuarioAutenticado = await login(correo, password);

      if (recordarme) {
        localStorage.setItem("huellitas_recordar_correo", correo);
      } else {
        localStorage.removeItem("huellitas_recordar_correo");
      }

      const destino = rutasPorRol[usuarioAutenticado.rol];

      navigate(destino || "/no-autorizado", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Revisa tu correo o contraseña e inténtalo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  }

  function manejarOlvidePassword(evento) {
    evento.preventDefault();
    setError("");
    setAvisoRecuperacion(
      "Para restablecer tu contraseña, comunícate con el área de Administración de Huellitas de Amor."
    );
  }

  return (
    <main className="login-page">
      {/* Panel izquierdo: fotografía y mensaje de clínica */}
      <section
        className="login-visual"
        style={{ backgroundImage: `url(${LoginVeterinariaImg})` }}
        aria-label="Presentación de Huellitas de Amor"
      >
        <div className="login-visual-overlay">
          <header className="login-brand">
            <div className="login-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="7" cy="8" r="2" />
                <circle cx="12" cy="6" r="2" />
                <circle cx="17" cy="8" r="2" />
                <path d="M12 11.5c-3.2 0-5.5 2.1-5.5 4.7 0 1.8 1.5 2.8 3.2 2.8 1 0 1.6-.4 2.3-.4.7 0 1.3.4 2.3.4 1.7 0 3.2-1 3.2-2.8 0-2.6-2.3-4.7-5.5-4.7z" />
              </svg>
            </div>
            <div className="login-brand-text">
              <span className="login-brand-name">Huellitas de Amor</span>
              <span className="login-brand-sub">CLÍNICA VETERINARIA</span>
            </div>
          </header>

          <div className="login-LoginVeterinaria-copy">
            <span className="login-kicker">CERCA DE ELLOS. CERCA DE TI.</span>
            <h1 className="login-LoginVeterinaria-title">
              Un equipo unido por el amor a sus huellitas.
            </h1>
            <p className="login-LoginVeterinaria-desc">
              La información que necesitas, en un solo lugar. Más tiempo para
              cuidar, menos tiempo en trámites.
            </p>
          </div>
        </div>
      </section>

      {/* Panel derecho: formulario de acceso */}
      <section className="login-panel">
        <div className="login-topbar">
          <span className="login-portal-label">PORTAL DEL EQUIPO</span>
          <span className="login-security-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Acceso seguro
          </span>
        </div>

        <div className="login-card">
          <div className="login-header">
            <h2>Qué gusto tenerte aquí</h2>
            <p>Ingresa con tu cuenta de Huellitas de Amor.</p>
          </div>

          <form className="login-form" onSubmit={manejarLogin} noValidate>
            <div className="login-field">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                placeholder="nombre@huellitas.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                className={error ? "input-error" : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              {error && (
                <p role="alert" className="login-error">
                  {error}
                </p>
              )}
              {avisoRecuperacion && (
                <p role="status" className="login-info">
                  {avisoRecuperacion}
                </p>
              )}
            </div>

            <div className="login-options">
              <label className="login-remember" htmlFor="recordarme">
                <input
                  id="recordarme"
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>
              <Link to="/recuperar-password" className="login-forgot">
                Olvidé mi contraseña
              </Link>
            </div>

            <button type="submit" className="login-submit" disabled={cargando}>
              <span>{cargando ? "Ingresando..." : "Iniciar sesión"}</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="login-roles-section">
            <p className="login-roles-title">UN ACCESO PARA CADA RESPONSABILIDAD</p>

            <div className="login-roles-grid">
              <div className="login-role-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>Recepción</span>
              </div>

              <div className="login-role-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </svg>
                <span>Veterinario</span>
              </div>

              <div className="login-role-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Administrador</span>
              </div>
            </div>

            <p className="login-roles-note">
              Tu rol asignado determina los módulos y permisos disponibles. Si
              necesitas acceso, contacta a Administración.
            </p>
          </div>

          <div className="login-authorized-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div>
              <strong>Solo para personal autorizado</strong>
              <p>Protegemos los datos de nuestros pacientes y sus familias.</p>
            </div>
          </div>

          <footer className="login-footer">
            <span>© 2026 Huellitas de Amor</span>
            <span>·</span>
            <span>Privacidad y protección de datos</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
