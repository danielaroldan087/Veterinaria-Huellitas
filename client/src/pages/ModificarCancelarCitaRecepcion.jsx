import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./ModificarCancelarCitaRecepcion.css";

const horasDisponiblesReprog = [
  "09:00",
  "09:30",
  "10:00",
  "11:00",
  "14:00",
  "15:30"
];

const motivosCancelacion = [
  "Solicitud del propietario",
  "Inconveniente del paciente",
  "Reprogramación pendiente",
  "Cambio de disponibilidad médica"
];

export default function ModificarCancelarCitaRecepcion() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const responsableAuditoria = usuario?.nombre || "Sofía Ramírez";

  // Estado para Reprogramar cita
  const [nuevaFecha, setNuevaFecha] = useState("27 / 10 / 2026");
  const [nuevaHora, setNuevaHora] = useState("09:30");
  const [profesional, setProfesional] = useState("Dra. Ana Martínez");
  const [motivoReprogramacion, setMotivoReprogramacion] = useState(
    "La propietaria solicita trasladar la cita al día siguiente por motivos de trabajo."
  );
  const [notificarCambio, setNotificarCambio] = useState(true);

  // Estado para Cancelar cita
  const [motivoCancelacion, setMotivoCancelacion] = useState(
    "Solicitud del propietario"
  );
  const [detalleCancelacion, setDetalleCancelacion] = useState("");
  const [solicitadoPor, setSolicitadoPor] = useState(
    "María García López · Propietaria"
  );
  const [confirmaCancelacion, setConfirmaCancelacion] = useState(false);

  // Mensajes de feedback
  const [errorAccion, setErrorAccion] = useState("");
  const [exitoAccion, setExitoAccion] = useState("");

  function manejarVolverAgenda() {
    navigate("/recepcionista/agenda");
  }

  function manejarSeleccionSeccion(id) {
    if (id === "inicio") {
      navigate("/recepcionista/inicio");
      return;
    }
    if (id === "propietarios") {
      navigate("/recepcionista/propietarios");
      return;
    }
    if (id === "mascotas") {
      navigate("/recepcionista/mascotas");
      return;
    }
    if (id === "agenda") {
      navigate("/recepcionista/agenda");
      return;
    }
    setExitoAccion(`Sección "${id}" en preparación.`);
    setErrorAccion("");
  }

  function manejarDescartarReprogramacion() {
    setNuevaFecha("27 / 10 / 2026");
    setNuevaHora("09:30");
    setProfesional("Dra. Ana Martínez");
    setMotivoReprogramacion(
      "La propietaria solicita trasladar la cita al día siguiente por motivos de trabajo."
    );
    setNotificarCambio(true);
    setErrorAccion("");
    setExitoAccion("Cambios de reprogramación descartados.");
  }

  function manejarGuardarNuevaFecha(evento) {
    evento.preventDefault();
    setErrorAccion("");
    setExitoAccion("");

    if (!nuevaFecha.trim() || !nuevaHora.trim() || !motivoReprogramacion.trim()) {
      setErrorAccion(
        "Completa la nueva fecha, la nueva hora y el motivo de reprogramación (*)."
      );
      return;
    }

    setExitoAccion(
      `Cita CIT-01026 reprogramada para ${nuevaFecha.trim()} a las ${nuevaHora} con ${profesional}${
        notificarCambio ? " · Notificación enviada a María García." : "."
      }`
    );
  }

  function manejarConservarCita() {
    setConfirmaCancelacion(false);
    setDetalleCancelacion("");
    setErrorAccion("");
    setExitoAccion("La cita CIT-01026 se conserva en su horario actual.");
  }

  function manejarConfirmarCancelacion(evento) {
    evento.preventDefault();
    setErrorAccion("");
    setExitoAccion("");

    if (!motivoCancelacion.trim() || !detalleCancelacion.trim()) {
      setErrorAccion(
        "Selecciona un motivo y completa el detalle de la cancelación (*)."
      );
      return;
    }

    if (!confirmaCancelacion) {
      setErrorAccion(
        "Debes marcar la casilla de confirmación para cancelar la cita CIT-01026."
      );
      return;
    }

    setExitoAccion(
      `Cita CIT-01026 cancelada (${motivoCancelacion}). El horario ha sido liberado.`
    );
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Agenda / Modificar o cancelar cita"
      seccionActivaInicial="agenda"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="mod-cita-header-row">
        <div>
          <h1 className="mod-cita-title">Modificar o cancelar cita</h1>
          <p className="mod-cita-subtitle">
            CIT-01026 · Conserva la trazabilidad de cada cambio de la reserva.
          </p>
        </div>

        <button
          type="button"
          className="mod-cita-btn-back"
          onClick={manejarVolverAgenda}
        >
          <span>←</span>
          <span>Volver a agenda</span>
        </button>
      </div>

      {/* Tarjeta superior del paciente */}
      <section className="mod-cita-patient-card" aria-label="Datos del paciente">
        <div className="mod-cita-patient-left">
          <div className="mod-cita-pet-avatar" aria-hidden="true">
            🐶
          </div>
          <div>
            <div className="mod-cita-pet-line">
              <strong>Luna</strong>
              <span>·</span>
              <span className="mod-cita-code-tag">PAC-00128</span>
            </div>
            <div className="mod-cita-pet-sub">
              Canino · Golden retriever · 3 años
            </div>
          </div>
        </div>

        <div className="mod-cita-patient-meta">
          <span className="mod-cita-meta-label">Propietaria</span>
          <strong className="mod-cita-meta-val">María García López</strong>
        </div>

        <div className="mod-cita-patient-meta">
          <span className="mod-cita-meta-label">Último peso</span>
          <strong className="mod-cita-meta-val">28,4 kg · 26 oct 2026</strong>
        </div>

        <div className="mod-cita-patient-right">
          <span className="mod-cita-allergy-chip">Alergia: penicilina</span>
          <button
            type="button"
            className="mod-cita-btn-ficha"
            onClick={() =>
              setExitoAccion("Abriendo ficha clínica de Luna (PAC-00128).")
            }
          >
            Ver ficha
          </button>
        </div>
      </section>

      {/* Banda de cita actual */}
      <section className="mod-cita-current-bar" aria-label="Cita actual">
        <div>
          <span className="mod-cita-meta-label">Cita actual</span>
          <strong className="mod-cita-meta-val">
            26 oct 2026 · 09:30–10:00
          </strong>
        </div>

        <div>
          <span className="mod-cita-meta-label">Profesional</span>
          <strong className="mod-cita-meta-val">Dra. Ana Martínez</strong>
        </div>

        <div>
          <span className="mod-cita-meta-label">Servicio</span>
          <strong className="mod-cita-meta-val">Consulta general</strong>
        </div>

        <span className="mod-cita-confirmed-pill">Confirmada</span>
      </section>

      {errorAccion && (
        <p role="alert" className="mod-cita-error">
          {errorAccion}
        </p>
      )}
      {exitoAccion && (
        <p role="status" className="mod-cita-success">
          {exitoAccion}
        </p>
      )}

      {/* Grid de 2 columnas: Reprogramar cita + Cancelar cita */}
      <div className="mod-cita-grid">
        {/* Columna izquierda: Reprogramar cita */}
        <section className="mod-cita-card" aria-label="Reprogramar cita">
          <div className="mod-cita-card-head">
            <h2>Reprogramar cita</h2>
            <p>Cambia la fecha o la hora sin perder la información de la visita.</p>
          </div>

          <form
            className="mod-cita-form"
            onSubmit={manejarGuardarNuevaFecha}
            noValidate
          >
            <div className="mod-cita-two-cols">
              <div className="mod-cita-field">
                <label htmlFor="mod-nueva-fecha">Nueva fecha *</label>
                <input
                  id="mod-nueva-fecha"
                  type="text"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                />
              </div>

              <div className="mod-cita-field">
                <label htmlFor="mod-nueva-hora">Nueva hora *</label>
                <select
                  id="mod-nueva-hora"
                  value={nuevaHora}
                  onChange={(e) => setNuevaHora(e.target.value)}
                >
                  {horasDisponiblesReprog.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mod-cita-field">
              <label htmlFor="mod-profesional">Profesional</label>
              <select
                id="mod-profesional"
                value={profesional}
                onChange={(e) => setProfesional(e.target.value)}
              >
                <option value="Dra. Ana Martínez">Dra. Ana Martínez</option>
                <option value="Dr. Carlos Paredes">Dr. Carlos Paredes</option>
              </select>
            </div>

            <div className="mod-cita-field">
              <label htmlFor="mod-motivo-reprog">
                Motivo de reprogramación *
              </label>
              <textarea
                id="mod-motivo-reprog"
                rows="3"
                value={motivoReprogramacion}
                onChange={(e) => setMotivoReprogramacion(e.target.value)}
              />
            </div>

            <div className="mod-cita-slot-ok">
              <span className="mod-cita-slot-ok-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>Nuevo horario disponible</strong>
                <p>
                  Martes 27 oct · {nuevaHora}–10:00 · Consultorio 1
                </p>
              </div>
            </div>

            <label className="mod-cita-checkbox" htmlFor="mod-notificar">
              <input
                id="mod-notificar"
                type="checkbox"
                checked={notificarCambio}
                onChange={(e) => setNotificarCambio(e.target.checked)}
              />
              <span>Notificar el cambio a María García</span>
            </label>

            <div className="mod-cita-card-footer">
              <button
                type="button"
                className="mod-cita-btn-discard"
                onClick={manejarDescartarReprogramacion}
              >
                Descartar
              </button>

              <button type="submit" className="mod-cita-btn-save">
                <span>📅</span>
                <span>Guardar nueva fecha</span>
              </button>
            </div>
          </form>
        </section>

        {/* Columna derecha: Cancelar cita */}
        <section className="mod-cita-card" aria-label="Cancelar cita">
          <div className="mod-cita-card-head">
            <h2>Cancelar cita</h2>
            <p>
              Esta opción libera el horario y mantiene el registro de la
              cancelación.
            </p>
          </div>

          <form
            className="mod-cita-form"
            onSubmit={manejarConfirmarCancelacion}
            noValidate
          >
            <div className="mod-cita-danger-notice" role="note">
              <span className="mod-cita-danger-icon" aria-hidden="true">
                !
              </span>
              <div>
                <strong>La cancelación no se puede deshacer</strong>
                <p>
                  Si la paciente necesita una nueva visita, será necesario
                  programar otra cita.
                </p>
              </div>
            </div>

            <div className="mod-cita-field">
              <label htmlFor="mod-motivo-cancel">Motivo de cancelación *</label>
              <select
                id="mod-motivo-cancel"
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
              >
                {motivosCancelacion.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>

            <div className="mod-cita-field">
              <label htmlFor="mod-detalle-cancel">
                Detalle de la cancelación *
              </label>
              <textarea
                id="mod-detalle-cancel"
                rows="3"
                placeholder="Describe por qué se cancela la cita..."
                value={detalleCancelacion}
                onChange={(e) => setDetalleCancelacion(e.target.value)}
              />
            </div>

            <div className="mod-cita-field">
              <label htmlFor="mod-solicitado-por">Solicitado por</label>
              <input
                id="mod-solicitado-por"
                type="text"
                value={solicitadoPor}
                onChange={(e) => setSolicitadoPor(e.target.value)}
              />
            </div>

            <label className="mod-cita-checkbox" htmlFor="mod-confirma-cancel">
              <input
                id="mod-confirma-cancel"
                type="checkbox"
                checked={confirmaCancelacion}
                onChange={(e) => setConfirmaCancelacion(e.target.checked)}
              />
              <span>Confirmo que deseo cancelar la cita CIT-01026.</span>
            </label>

            <div className="mod-cita-card-footer">
              <button
                type="button"
                className="mod-cita-btn-keep"
                onClick={manejarConservarCita}
              >
                Conservar cita
              </button>

              <button type="submit" className="mod-cita-btn-cancel-confirm">
                <span>🗓</span>
                <span>Confirmar cancelación</span>
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Nota de trazabilidad */}
      <p className="mod-cita-audit-note">
        Los cambios registrarán la fecha, el motivo y el usuario responsable:{" "}
        {responsableAuditoria} · Recepción.
      </p>
    </LayoutRecepcion>
  );
}