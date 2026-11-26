import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./ProgramarCitaRecepcion.css";

const pacientesDisponibles = [
  {
    id: 1,
    etiqueta: "Luna · María García López · DNI 45872136",
    mascota: "Luna",
    propietaria: "María García López",
    telefono: "987 654 321",
    alergia: "Luna tiene alergia a la penicilina."
  },
  {
    id: 2,
    etiqueta: "Milo · Carlos Mendoza Ruiz · DNI 70234518",
    mascota: "Milo",
    propietaria: "Carlos Mendoza Ruiz",
    telefono: "956 123 480",
    alergia: ""
  },
  {
    id: 3,
    etiqueta: "Kira · Elena Rojas Pérez · DNI 41897265",
    mascota: "Kira",
    propietaria: "Elena Rojas Pérez",
    telefono: "944 820 156",
    alergia: ""
  },
  {
    id: 4,
    etiqueta: "Rocky · Jorge Salazar Díaz · DNI 60124893",
    mascota: "Rocky",
    propietaria: "Jorge Salazar Díaz",
    telefono: "998 412 300",
    alergia: ""
  }
];

const serviciosDisponibles = [
  { etiqueta: "Consulta general · 30 minutos", resumen: "Consulta general · 30 min" },
  { etiqueta: "Vacunación · 20 minutos", resumen: "Vacunación · 20 min" },
  { etiqueta: "Control · 20 minutos", resumen: "Control · 20 min" },
  { etiqueta: "Desparasitación · 15 minutos", resumen: "Desparasitación · 15 min" }
];

const horariosFilaSuperior = ["09:30", "12:30", "13:00", "13:30", "14:30"];
const horariosFilaInferior = ["15:00", "15:30", "16:00", "16:30", "17:00"];
const horariosOcupados = ["12:30", "13:30", "16:30"];

export default function ProgramarCitaRecepcion() {
  const navigate = useNavigate();

  const [pacienteId, setPacienteId] = useState(pacientesDisponibles[0].id);
  const [servicioEtiqueta, setServicioEtiqueta] = useState(
    serviciosDisponibles[0].etiqueta
  );
  const [profesional, setProfesional] = useState("Dra. Ana Martínez");
  const [fechaInput, setFechaInput] = useState("26 / 10 / 2026");
  const [consultorio, setConsultorio] = useState("Consultorio 1");
  const [horaSeleccionada, setHoraSeleccionada] = useState("09:30");
  const [motivoConsulta, setMotivoConsulta] = useState(
    "Enrojecimiento y picazón en la zona abdominal desde hace tres días."
  );
  const [enviarCorreo, setEnviarCorreo] = useState(true);

  const [errorForm, setErrorForm] = useState("");
  const [exitoForm, setExitoForm] = useState("");

  const pacienteActivo = useMemo(() => {
    return (
      pacientesDisponibles.find((p) => p.id === Number(pacienteId)) ||
      pacientesDisponibles[0]
    );
  }, [pacienteId]);

  const servicioResumen = useMemo(() => {
    const encontrado = serviciosDisponibles.find(
      (s) => s.etiqueta === servicioEtiqueta
    );
    return encontrado ? encontrado.resumen : servicioEtiqueta;
  }, [servicioEtiqueta]);

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
    setExitoForm(`Sección "${id}" en preparación.`);
    setErrorForm("");
  }

  function manejarConfirmarCita(evento) {
    evento.preventDefault();
    setErrorForm("");
    setExitoForm("");

    if (
      !horaSeleccionada ||
      !fechaInput.trim() ||
      !motivoConsulta.trim()
    ) {
      setErrorForm(
        "Selecciona un horario disponible y completa los campos obligatorios (*)."
      );
      return;
    }

    if (horariosOcupados.includes(horaSeleccionada)) {
      setErrorForm(
        `El horario ${horaSeleccionada} ya no está disponible para ${profesional}.`
      );
      return;
    }

    setExitoForm(
      `Cita confirmada para ${pacienteActivo.mascota} el ${fechaInput.trim()} a las ${horaSeleccionada} con ${profesional} (${consultorio})${
        enviarCorreo ? " · Notificación enviada al correo." : "."
      }`
    );
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Agenda / Programar cita"
      seccionActivaInicial="agenda"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="prog-cita-header-row">
        <div>
          <h1 className="prog-cita-title">Programar cita</h1>
          <p className="prog-cita-subtitle">
            Selecciona un paciente y reserva un horario disponible para su
            atención.
          </p>
        </div>

        <button
          type="button"
          className="prog-cita-btn-back"
          onClick={manejarVolverAgenda}
        >
          <span>←</span>
          <span>Volver a agenda</span>
        </button>
      </div>

      {/* Grid principal: Datos de la cita izquierda + Resumen derecha */}
      <div className="prog-cita-grid">
        <section className="prog-cita-card" aria-label="Datos de la cita">
          <div className="prog-cita-card-header">
            <h2>Datos de la cita</h2>
            <p>Una nueva visita para seguir cuidando de {pacienteActivo.mascota}.</p>
          </div>

          <form
            className="prog-cita-form"
            onSubmit={manejarConfirmarCita}
            noValidate
          >
            <div className="prog-cita-field">
              <label htmlFor="prog-paciente">Mascota / propietario *</label>
              <select
                id="prog-paciente"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
              >
                {pacientesDisponibles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.etiqueta}
                  </option>
                ))}
              </select>
            </div>

            <div className="prog-cita-two-cols">
              <div className="prog-cita-field">
                <label htmlFor="prog-servicio">Servicio *</label>
                <select
                  id="prog-servicio"
                  value={servicioEtiqueta}
                  onChange={(e) => setServicioEtiqueta(e.target.value)}
                >
                  {serviciosDisponibles.map((srv) => (
                    <option key={srv.etiqueta} value={srv.etiqueta}>
                      {srv.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="prog-cita-field">
                <label htmlFor="prog-profesional">Profesional *</label>
                <select
                  id="prog-profesional"
                  value={profesional}
                  onChange={(e) => setProfesional(e.target.value)}
                >
                  <option value="Dra. Ana Martínez">Dra. Ana Martínez</option>
                  <option value="Dr. Carlos Paredes">Dr. Carlos Paredes</option>
                </select>
              </div>
            </div>

            <div className="prog-cita-two-cols">
              <div className="prog-cita-field">
                <label htmlFor="prog-fecha">Fecha *</label>
                <input
                  id="prog-fecha"
                  type="text"
                  value={fechaInput}
                  onChange={(e) => setFechaInput(e.target.value)}
                />
              </div>

              <div className="prog-cita-field">
                <label htmlFor="prog-consultorio">Consultorio</label>
                <select
                  id="prog-consultorio"
                  value={consultorio}
                  onChange={(e) => setConsultorio(e.target.value)}
                >
                  <option value="Consultorio 1">Consultorio 1</option>
                  <option value="Consultorio 2">Consultorio 2</option>
                </select>
              </div>
            </div>

            <div className="prog-cita-field">
              <div className="prog-cita-slots-top">
                <label>Horarios disponibles *</label>
                <span className="prog-cita-tz">Hora de Lima · GMT-5</span>
              </div>

              <div className="prog-cita-slots-grid" role="group" aria-label="Horarios disponibles">
                {[...horariosFilaSuperior, ...horariosFilaInferior].map(
                  (hora) => {
                    const estaOcupado = horariosOcupados.includes(hora);
                    const estaSeleccionada = horaSeleccionada === hora;

                    return (
                      <button
                        key={hora}
                        type="button"
                        disabled={estaOcupado}
                        className={`prog-cita-slot ${
                          estaSeleccionada ? "is-selected" : ""
                        } ${estaOcupado ? "is-disabled" : ""}`}
                        onClick={() => setHoraSeleccionada(hora)}
                      >
                        {hora}
                      </button>
                    );
                  }
                )}
              </div>

              <span className="prog-cita-helper">
                Solo se muestran horarios libres de la profesional seleccionada.
              </span>
            </div>

            <div className="prog-cita-field">
              <label htmlFor="prog-motivo">Motivo de consulta *</label>
              <textarea
                id="prog-motivo"
                rows="3"
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
              />
            </div>

            <label className="prog-cita-checkbox" htmlFor="prog-enviar-correo">
              <input
                id="prog-enviar-correo"
                type="checkbox"
                checked={enviarCorreo}
                onChange={(e) => setEnviarCorreo(e.target.checked)}
              />
              <span>Enviar confirmación al correo de la propietaria</span>
            </label>

            {errorForm && (
              <p role="alert" className="prog-cita-error">
                {errorForm}
              </p>
            )}
            {exitoForm && (
              <p role="status" className="prog-cita-success">
                {exitoForm}
              </p>
            )}

            <div className="prog-cita-form-footer">
              <span className="prog-cita-required-note">
                Los campos con * son obligatorios.
              </span>

              <div className="prog-cita-actions">
                <button
                  type="button"
                  className="prog-cita-btn-cancel"
                  onClick={manejarVolverAgenda}
                >
                  Cancelar
                </button>
                <button type="submit" className="prog-cita-btn-confirm">
                  <span>✓</span>
                  <span>Confirmar cita</span>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Columna derecha: Resumen de la cita + avisos */}
        <aside className="prog-cita-side-col" aria-label="Resumen de la cita">
          <section className="prog-cita-card">
            <h2 className="prog-cita-summary-title">Resumen de la cita</h2>

            <span className="prog-cita-pending-pill">Por confirmar</span>

            <div className="prog-cita-pet-heading">
              <span aria-hidden="true">🐾</span>
              <strong>{pacienteActivo.mascota}</strong>
            </div>

            <div className="prog-cita-summary-item">
              <span className="prog-cita-summary-label">Propietaria</span>
              <strong className="prog-cita-summary-value">
                {pacienteActivo.propietaria}
              </strong>
            </div>

            <div className="prog-cita-summary-item">
              <span className="prog-cita-summary-label">Fecha y hora</span>
              <strong className="prog-cita-summary-value">
                Lun, 26 oct 2026 · {horaSeleccionada}
              </strong>
            </div>

            <div className="prog-cita-summary-item">
              <span className="prog-cita-summary-label">Atención</span>
              <strong className="prog-cita-summary-value">
                {servicioResumen}
              </strong>
            </div>

            <div className="prog-cita-summary-item">
              <span className="prog-cita-summary-label">Profesional</span>
              <strong className="prog-cita-summary-value">
                {profesional}
              </strong>
            </div>

            <div className="prog-cita-summary-item">
              <span className="prog-cita-summary-label">Contacto</span>
              <strong className="prog-cita-summary-value">
                {pacienteActivo.telefono}
              </strong>
            </div>
          </section>

          <div className="prog-cita-available-banner" role="note">
            <span className="prog-cita-available-icon" aria-hidden="true">
              ✓
            </span>
            <div>
              <strong>Horario disponible</strong>
              <p>
                No hay otras citas en el horario seleccionado. Se verificará
                nuevamente al confirmar.
              </p>
            </div>
          </div>

          {pacienteActivo.alergia && (
            <div className="prog-cita-allergy-banner" role="alert">
              <span className="prog-cita-allergy-icon" aria-hidden="true">
                !
              </span>
              <div>
                <strong>Alergia registrada</strong>
                <p>{pacienteActivo.alergia}</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </LayoutRecepcion>
  );
}