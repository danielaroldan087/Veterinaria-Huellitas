import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./PerfilRecepcion.css";
import "./CambiarPasswordRecepcion.css";

export default function CambiarPasswordRecpcion() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const nombreUsuario = usuario?.nombre || "Sofía Ramírez";

  const [claveActual, setClaveActual] = useState("");
  const [claveNueva, setClaveNueva] = useState("");
  const [claveConfirmar, setClaveConfirmar] = useState("");
  const [cerrarOtrasSesiones, setCerrarOtrasSesiones] = useState(true);
  const [errorClave, setErrorClave] = useState("");
  const [exitoClave, setExitoClave] = useState("");

  const tieneLongitudMinima = claveNueva.length >= 10;
  const tieneMayusMinusNumero =
    /[A-Z]/.test(claveNueva) &&
    /[a-z]/.test(claveNueva) &&
    /[0-9]/.test(claveNueva);
  const esDiferenteActual =
    claveNueva.length > 0 && claveNueva !== claveActual;
  const contraseñasCoinciden =
    claveNueva.length > 0 && claveNueva === claveConfirmar;

  const claveListaYSegura =
    tieneLongitudMinima &&
    tieneMayusMinusNumero &&
    esDiferenteActual &&
    contraseñasCoinciden;

  function manejarVolverPerfil() {
    navigate("/recepcionista");
  }

  function manejarActualizarClave(evento) {
    evento.preventDefault();
    setErrorClave("");
    setExitoClave("");

    if (!claveActual.trim() || !claveNueva.trim() || !claveConfirmar.trim()) {
      setErrorClave("Completa todos los campos obligatorios (*).");
      return;
    }

    if (!tieneLongitudMinima) {
      setErrorClave("La nueva contraseña debe tener al menos 10 caracteres.");
      return;
    }

    if (!tieneMayusMinusNumero) {
      setErrorClave(
        "La nueva contraseña debe incluir mayúsculas, minúsculas y al menos un número."
      );
      return;
    }

    if (!esDiferenteActual) {
      setErrorClave("La nueva contraseña debe ser diferente a la actual.");
      return;
    }

    if (!contraseñasCoinciden) {
      setErrorClave("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setExitoClave(
      cerrarOtrasSesiones
        ? "Contraseña actualizada correctamente. Se cerraron las demás sesiones activas."
        : "Contraseña actualizada correctamente."
    );
    setClaveActual("");
    setClaveNueva("");
    setClaveConfirmar("");
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Mi perfil / Cambiar contraseña"
      titulo="Cambiar contraseña"
      subtitulo="Mantén tu cuenta protegida y actualiza tus credenciales cuando lo necesites."
      seccionActivaInicial="perfil"
    >
      <div className="recep-tabs" role="tablist" aria-label="Secciones de seguridad">
        <button
          type="button"
          role="tab"
          aria-selected="false"
          className="recep-tab"
          onClick={manejarVolverPerfil}
        >
          Datos personales
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="recep-tab is-active"
        >
          Seguridad
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          className="recep-tab"
          onClick={manejarVolverPerfil}
        >
          Actividad de acceso
        </button>
      </div>

      <div className="pwd-notice-banner" role="note">
        <span className="pwd-notice-icon" aria-hidden="true">i</span>
        <div>
          <strong>Primer ingreso: actualiza tu contraseña temporal</strong>
          <p>
            Elige una clave personal antes de continuar. Esta misma sección
            estará disponible cuando quieras cambiarla.
          </p>
        </div>
      </div>

      <div className="recep-grid">
        <div className="recep-col-main">
          <section className="recep-card" aria-label="Nueva contraseña">
            <div className="recep-card-header">
              <h2>Nueva contraseña</h2>
              <p>Cuenta de {nombreUsuario} · Recepción</p>
            </div>

            <form
              className="recep-form pwd-form-spaced"
              onSubmit={manejarActualizarClave}
              noValidate
            >
              <div className="recep-field">
                <label htmlFor="pwd-actual">Contraseña actual *</label>
                <input
                  id="pwd-actual"
                  type="password"
                  placeholder="••••••••••••"
                  value={claveActual}
                  onChange={(e) => setClaveActual(e.target.value)}
                />
              </div>

              <div className="recep-two-cols">
                <div className="recep-field">
                  <label htmlFor="pwd-nueva">Nueva contraseña *</label>
                  <input
                    id="pwd-nueva"
                    type="password"
                    placeholder="••••••••••••"
                    value={claveNueva}
                    onChange={(e) => setClaveNueva(e.target.value)}
                  />
                </div>

                <div className="recep-field">
                  <label htmlFor="pwd-confirmar">
                    Confirmar nueva contraseña *
                  </label>
                  <input
                    id="pwd-confirmar"
                    type="password"
                    placeholder="••••••••••••"
                    value={claveConfirmar}
                    onChange={(e) => setClaveConfirmar(e.target.value)}
                  />
                </div>
              </div>

              <div
                className={`pwd-strength-box ${
                  claveListaYSegura ? "is-ready" : ""
                }`}
              >
                <span className="pwd-strength-icon" aria-hidden="true">✓</span>
                <div>
                  <strong>Contraseña segura</strong>
                  <p>
                    {claveListaYSegura
                      ? "Las contraseñas coinciden y cumplen todos los requisitos."
                      : "Usa al menos 10 caracteres, mayúscula, minúscula, número y que coincidan."}
                  </p>
                </div>
              </div>

              <label className="pwd-checkbox-row" htmlFor="cerrar-otras-sesiones">
                <input
                  id="cerrar-otras-sesiones"
                  type="checkbox"
                  checked={cerrarOtrasSesiones}
                  onChange={(e) => setCerrarOtrasSesiones(e.target.checked)}
                />
                <span>Cerrar las demás sesiones al guardar</span>
              </label>

              {errorClave && (
                <p role="alert" className="recep-error">
                  {errorClave}
                </p>
              )}
              {exitoClave && (
                <p role="status" className="recep-success">
                  {exitoClave}
                </p>
              )}

              <div className="recep-form-footer">
                <span className="recep-required-note">
                  Los campos con * son obligatorios.
                </span>
                <div className="recep-actions">
                  <button
                    type="button"
                    className="recep-btn-secondary"
                    onClick={manejarVolverPerfil}
                  >
                    Volver a mi perfil
                  </button>
                  <button type="submit" className="recep-btn-primary">
                    <span>✓</span>
                    <span>Actualizar contraseña</span>
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>

        <aside className="recep-col-side">
          <section className="recep-card" aria-label="Tu seguridad importa">
            <h2>Tu seguridad importa</h2>
            <div className="pwd-shield-icon" aria-hidden="true">🛡</div>

            <p className="recep-side-desc">
              Una contraseña fuerte ayuda a proteger los datos de los
              pacientes.
            </p>

            <ul className="pwd-rules-list">
              <li className={tieneLongitudMinima ? "is-met" : ""}>
                <span>✓</span>
                <span>10 caracteres como mínimo</span>
              </li>
              <li className={tieneMayusMinusNumero ? "is-met" : ""}>
                <span>✓</span>
                <span>Mayúsculas y minúsculas</span>
              </li>
              <li className={/[0-9]/.test(claveNueva) ? "is-met" : ""}>
                <span>✓</span>
                <span>Al menos un número</span>
              </li>
              <li className={esDiferenteActual ? "is-met" : ""}>
                <span>✓</span>
                <span>Diferente a la contraseña actual</span>
              </li>
            </ul>
          </section>

          <section className="recep-card" aria-label="Última actualización">
            <h2>Última actualización</h2>

            <div className="recep-meta-block">
              <span className="recep-meta-label">Fecha</span>
              <strong className="recep-meta-value">
                {exitoClave ? "Actualizada hoy" : "Pendiente · primer ingreso"}
              </strong>
            </div>

            {!exitoClave && (
              <span className="pwd-warning-pill">Cambio requerido</span>
            )}

            <p className="recep-side-footnote">
              Nunca compartas tus credenciales. Administración no te pedirá tu
              contraseña.
            </p>
          </section>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}