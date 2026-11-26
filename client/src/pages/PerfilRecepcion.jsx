import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./PerfilRecepcion.css";

const accesosRecientes = [
  {
    id: 1,
    fecha: "26 oct 2026 · 08:02",
    dispositivo: "Chrome · Windows",
    ubicacion: "Miraflores, Lima",
    estado: "Sesión actual",
    activa: true
  },
  {
    id: 2,
    fecha: "24 oct 2026 · 08:00",
    dispositivo: "Chrome · Windows",
    ubicacion: "Miraflores, Lima",
    estado: "Finalizada",
    activa: false
  }
];

function obtenerIniciales(nombreCompleto = "") {
  const partes = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "SR";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
}

function separarNombreYApellido(nombreCompleto = "") {
  const partes = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length <= 1) {
    return {
      nombres: partes[0] || "Sofía",
      apellidos: "Ramírez Castro"
    };
  }
  return {
    nombres: partes[0],
    apellidos: partes.slice(1).join(" ")
  };
}

export default function PerfilRecepcion() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const nombreBase = usuario?.nombre || "Sofía Ramírez";
  const iniciales = obtenerIniciales(nombreBase);
  const { nombres: nombresIniciales, apellidos: apellidosIniciales } =
    separarNombreYApellido(nombreBase);
  const correoInicial = usuario?.correo || "sofia.ramirez@huellitas.pe";
  const sedeAsignada = usuario?.sede || "Miraflores";

  const [pestanaActiva, setPestanaActiva] = useState("datos");
  const [nombres, setNombres] = useState(nombresIniciales);
  const [apellidos, setApellidos] = useState(apellidosIniciales);
  const [correo, setCorreo] = useState(correoInicial);
  const [estadoGuardado, setEstadoGuardado] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");

  useEffect(() => {
    setNombres(nombresIniciales);
    setApellidos(apellidosIniciales);
    setCorreo(correoInicial);
  }, [nombresIniciales, apellidosIniciales, correoInicial]);

  function manejarCancelar() {
    setNombres(nombresIniciales);
    setApellidos(apellidosIniciales);
    setCorreo(correoInicial);
    setErrorGuardado("");
    setEstadoGuardado("Cambios descartados.");
  }

  function manejarGuardarCambios(evento) {
    evento.preventDefault();
    setErrorGuardado("");
    setEstadoGuardado("");

    if (!nombres.trim() || !apellidos.trim() || !correo.trim()) {
      setErrorGuardado("Completa los campos obligatorios (*).");
      return;
    }

    if (!correo.includes("@")) {
      setErrorGuardado("Ingresa un correo electrónico válido.");
      return;
    }

    setEstadoGuardado("Información personal actualizada correctamente.");
  }

  function irACambiarPassword() {
    navigate("/recepcionista/cambiar-password");
  }

  const nombreMostrado = `${nombres} ${apellidos}`.trim() || nombreBase;

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Mi perfil / Mi perfil"
      titulo="Mi perfil"
      subtitulo="Consulta tus datos personales y mantén tu información actualizada."
      seccionActivaInicial="perfil"
    >
      <div className="recep-tabs" role="tablist" aria-label="Secciones de perfil">
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === "datos"}
          className={`recep-tab ${pestanaActiva === "datos" ? "is-active" : ""}`}
          onClick={() => setPestanaActiva("datos")}
        >
          Datos personales
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === "seguridad"}
          className={`recep-tab ${pestanaActiva === "seguridad" ? "is-active" : ""}`}
          onClick={irACambiarPassword}
        >
          Seguridad
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === "actividad"}
          className={`recep-tab ${pestanaActiva === "actividad" ? "is-active" : ""}`}
          onClick={() => setPestanaActiva("actividad")}
        >
          Actividad de acceso
        </button>
      </div>

      <div className="recep-grid">
        <div className="recep-col-main">
          <section className="recep-card" aria-label="Información personal">
            <div className="recep-card-header">
              <h2>Información personal</h2>
              <p>Estos datos identifican tus acciones dentro de la clínica.</p>
            </div>

            <div className="recep-identity-row">
              <div className="recep-avatar" aria-hidden="true">
                {iniciales}
              </div>
              <div>
                <div className="recep-identity-name">{nombreMostrado}</div>
                <span className="recep-role-pill">Recepción</span>
              </div>
            </div>

            <form className="recep-form" onSubmit={manejarGuardarCambios} noValidate>
              <div className="recep-two-cols">
                <div className="recep-field">
                  <label htmlFor="recep-nombres">Nombres *</label>
                  <input
                    id="recep-nombres"
                    type="text"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                  />
                </div>

                <div className="recep-field">
                  <label htmlFor="recep-apellidos">Apellidos *</label>
                  <input
                    id="recep-apellidos"
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                  />
                </div>
              </div>

              <div className="recep-field">
                <label htmlFor="recep-correo">Correo electrónico *</label>
                <input
                  id="recep-correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <span className="recep-helper">
                  Usa tu correo institucional para recibir avisos del sistema.
                </span>
              </div>

              {errorGuardado && (
                <p role="alert" className="recep-error">
                  {errorGuardado}
                </p>
              )}
              {estadoGuardado && (
                <p role="status" className="recep-success">
                  {estadoGuardado}
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
                    onClick={manejarCancelar}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="recep-btn-primary">
                    <span>✓</span>
                    <span>Guardar cambios</span>
                  </button>
                </div>
              </div>
            </form>
          </section>

          <section className="recep-card" aria-label="Accesos recientes">
            <div className="recep-card-top-row">
              <div>
                <h2>Accesos recientes</h2>
              </div>
              <button
                type="button"
                className="recep-btn-secondary recep-btn-sm"
                onClick={() => setPestanaActiva("actividad")}
              >
                Ver toda la actividad
              </button>
            </div>

            <div className="recep-table-wrap">
              <table className="recep-table">
                <thead>
                  <tr>
                    <th>FECHA</th>
                    <th>DISPOSITIVO</th>
                    <th>UBICACIÓN</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {accesosRecientes.map((item) => (
                    <tr key={item.id}>
                      <td className="recep-td-strong">{item.fecha}</td>
                      <td>{item.dispositivo}</td>
                      <td>{item.ubicacion}</td>
                      <td>
                        <span
                          className={`recep-status-pill ${
                            item.activa ? "is-current" : "is-finished"
                          }`}
                        >
                          {item.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="recep-col-side">
          <section className="recep-card" aria-label="Tu rol en la clínica">
            <h2>Tu rol en la clínica</h2>
            <span className="recep-role-pill">Recepción</span>

            <p className="recep-side-desc">
              Gestionas propietarios, mascotas y citas. Tu rol ha sido asignado
              por Administración.
            </p>

            <div className="recep-meta-block">
              <span className="recep-meta-label">Sede asignada</span>
              <strong className="recep-meta-value">{sedeAsignada}</strong>
            </div>

            <div className="recep-meta-block">
              <span className="recep-meta-label">Miembro desde</span>
              <strong className="recep-meta-value">12 de enero de 2025</strong>
            </div>

            <p className="recep-side-footnote">
              Para cambiar tu rol o tus permisos, contacta a Lucía Torres.
            </p>
          </section>

          <section className="recep-card" aria-label="Seguridad">
            <h2>Seguridad</h2>

            <div className="recep-meta-block">
              <span className="recep-meta-label">Último cambio de contraseña</span>
              <strong className="recep-meta-value">
                15 de septiembre de 2026
              </strong>
            </div>

            <button
              type="button"
              className="recep-btn-secondary recep-btn-full"
              onClick={irACambiarPassword}
            >
              <span>🔒</span>
              <span>Cambiar contraseña</span>
            </button>
          </section>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}