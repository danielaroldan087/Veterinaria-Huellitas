import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarPassword.css";

export default function RecuperarPassword() {
  // Paso 1: Solicitar enlace
  const [correo, setCorreo] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [enlaceEnviado, setEnlaceEnviado] = useState(false);

  // Paso 2: Reenviar enlace y temporizador
  const [segundosRestantes, setSegundosRestantes] = useState(45);

  // Paso 3: Crear nueva contraseña
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensajePassword, setMensajePassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  useEffect(() => {
    if (!enlaceEnviado || segundosRestantes <= 0) return;

    const timer = setInterval(() => {
      setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [enlaceEnviado, segundosRestantes]);

  const tieneLongitudMinima = nuevaPassword.length >= 10;
  const tieneMayusMinusNumero =
    /[A-Z]/.test(nuevaPassword) &&
    /[a-z]/.test(nuevaPassword) &&
    /[0-9]/.test(nuevaPassword);
  const contraseñasCoinciden =
    nuevaPassword.length > 0 && nuevaPassword === confirmarPassword;

  function manejarSolicitarEnlace(evento) {
    evento.preventDefault();
    setErrorCorreo("");

    if (!correo.trim() || !correo.includes("@")) {
      setErrorCorreo("Ingresa un correo electrónico válido.");
      return;
    }

    setEnlaceEnviado(true);
    setSegundosRestantes(45);
  }

  function manejarReenviarEnlace() {
    if (segundosRestantes > 0) return;
    setSegundosRestantes(45);
  }

  function manejarRestablecerPassword(evento) {
    evento.preventDefault();
    setErrorPassword("");
    setMensajePassword("");

    if (!tieneLongitudMinima || !tieneMayusMinusNumero) {
      setErrorPassword(
        "La contraseña debe tener al menos 10 caracteres e incluir mayúscula, minúscula y número."
      );
      return;
    }

    if (!contraseñasCoinciden) {
      setErrorPassword("Las contraseñas no coinciden.");
      return;
    }

    setMensajePassword(
      "Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva clave."
    );
    setNuevaPassword("");
    setConfirmarPassword("");
  }

  const tiempoFormateado = `00:${String(segundosRestantes).padStart(2, "0")}`;

  return (
    <main className="recover-page">
      {/* Cabecera superior */}
      <header className="recover-topbar">
        <div className="recover-brand">
          <div className="recover-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="7" cy="8" r="2" />
              <circle cx="12" cy="6" r="2" />
              <circle cx="17" cy="8" r="2" />
              <path d="M12 11.5c-3.2 0-5.5 2.1-5.5 4.7 0 1.8 1.5 2.8 3.2 2.8 1 0 1.6-.4 2.3-.4.7 0 1.3.4 2.3.4 1.7 0 3.2-1 3.2-2.8 0-2.6-2.3-4.7-5.5-4.7z" />
            </svg>
          </div>
          <div className="recover-brand-text">
            <span className="recover-brand-name">Huellitas de Amor</span>
            <span className="recover-brand-sub">CLÍNICA VETERINARIA</span>
          </div>
        </div>

        <Link to="/login" className="recover-back-btn">
          <span aria-hidden="true">←</span>
          <span>Volver al inicio de sesión</span>
        </Link>
      </header>

      <div className="recover-container">
        {/* Encabezado principal */}
        <section className="recover-hero">
          <span className="recover-badge">SEGURIDAD DE LA CUENTA</span>
          <h1 className="recover-title">Recupera el acceso, con tranquilidad.</h1>
          <p className="recover-subtitle">
            Te acompañamos en cada paso para que puedas volver a tu espacio de
            trabajo.
          </p>
        </section>

        {/* Tres tarjetas de flujo */}
        <section className="recover-grid" aria-label="Pasos de recuperación">
          {/* Tarjeta 1 */}
          <article className="recover-card">
            <div className="recover-card-head">
              <h2>Solicitar un enlace</h2>
              <p className="recover-step-label">Paso 1 · Identifica tu cuenta</p>
            </div>

            <div className="recover-icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            <p className="recover-card-desc">
              Escribe el correo con el que accedes al sistema. Te enviaremos un
              enlace seguro.
            </p>

            <form className="recover-form" onSubmit={manejarSolicitarEnlace} noValidate>
              <label htmlFor="recover-email">Correo electrónico *</label>
              <input
                id="recover-email"
                type="email"
                placeholder="nombre@huellitas.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {errorCorreo && (
                <p role="alert" className="recover-error">
                  {errorCorreo}
                </p>
              )}

              <button type="submit" className="recover-primary-btn">
                <span aria-hidden="true">➤</span>
                <span>Enviar enlace de recuperación</span>
              </button>
            </form>

            <p className="recover-footnote">
              Por seguridad, no indicamos si el correo pertenece a una cuenta
              registrada.
            </p>
          </article>

          {/* Tarjeta 2 */}
          <article
            className={`recover-card ${!enlaceEnviado ? "recover-card--muted" : ""}`}
          >
            <div className="recover-card-head">
              <h2>Revisa tu correo</h2>
              <p className="recover-step-label">Paso 2 · Enlace enviado</p>
            </div>

            <div className="recover-icon-circle" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
                <path d="m15 15 2 2 3-3" />
              </svg>
            </div>

            <h3 className="recover-card-subtitle">Tu enlace está en camino</h3>
            <p className="recover-card-desc">
              Si existe una cuenta asociada a{" "}
              <strong>{correo || "tu correo registrado"}</strong>, recibirás las
              instrucciones en unos minutos.
            </p>

            <div className="recover-callout">
              <span className="recover-callout-icon" aria-hidden="true">✓</span>
              <div>
                <strong>El enlace vence en 30 minutos</strong>
                <p>Revisa también tu carpeta de correo no deseado.</p>
              </div>
            </div>

            <button
              type="button"
              className="recover-outline-btn"
              onClick={manejarReenviarEnlace}
              disabled={!enlaceEnviado || segundosRestantes > 0}
            >
              Reenviar enlace · {tiempoFormateado}
            </button>

            <p className="recover-footnote">
              ¿No tienes acceso a ese correo? Contacta a la administradora de la
              clínica.
            </p>
          </article>

          {/* Tarjeta 3 */}
          <article className="recover-card">
            <div className="recover-card-head">
              <h2>Crea tu nueva contraseña</h2>
              <p className="recover-step-label">Paso 3 · Enlace verificado</p>
            </div>

            <span className="recover-valid-pill">Enlace válido</span>

            <form className="recover-form" onSubmit={manejarRestablecerPassword} noValidate>
              <label htmlFor="new-password">Nueva contraseña *</label>
              <input
                id="new-password"
                type="password"
                placeholder="••••••••••••"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
              />

              <label htmlFor="confirm-password">Confirmar nueva contraseña *</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••••••"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
              />

              <ul className="recover-checklist">
                <li className={tieneLongitudMinima ? "is-ok" : ""}>
                  <span>{tieneLongitudMinima ? "✓" : "•"}</span>
                  <span>Al menos 10 caracteres</span>
                </li>
                <li className={tieneMayusMinusNumero ? "is-ok" : ""}>
                  <span>{tieneMayusMinusNumero ? "✓" : "•"}</span>
                  <span>Mayúscula, minúscula y número</span>
                </li>
                <li className={contraseñasCoinciden ? "is-ok" : ""}>
                  <span>{contraseñasCoinciden ? "✓" : "•"}</span>
                  <span>Las contraseñas coinciden</span>
                </li>
              </ul>

              {errorPassword && (
                <p role="alert" className="recover-error">
                  {errorPassword}
                </p>
              )}
              {mensajePassword && (
                <p role="status" className="recover-success">
                  {mensajePassword}
                </p>
              )}

              <button type="submit" className="recover-primary-btn">
                <span aria-hidden="true">🔒</span>
                <span>Restablecer contraseña</span>
              </button>
            </form>

            <p className="recover-footnote">
              Después del cambio, inicia sesión con tu nueva contraseña. Las
              sesiones anteriores se cerrarán.
            </p>
          </article>
        </section>

        {/* Barra de soporte */}
        <section className="recover-support-bar" aria-label="Soporte de cuenta">
          <div className="recover-support-info">
            <span className="recover-support-icon" aria-hidden="true">🎧</span>
            <div>
              <strong>¿Necesitas ayuda con tu cuenta?</strong>
              <p>
                Administración · soporte@huellitas.com · Lunes a sábado,
                08:00–18:00
              </p>
            </div>
          </div>

          <a
            href="mailto:soporte@huellitas.com"
            className="recover-support-link"
          >
            <span>Contactar a soporte</span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>

        <footer className="recover-footer">
          Huellitas de Amor · Los enlaces de recuperación son personales y de un
          solo uso.
        </footer>
      </div>
    </main>
  );
}