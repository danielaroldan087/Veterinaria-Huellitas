import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./AgendaRecepcion.css";

const citasSemanaIniciales = [
  {
    id: 1,
    codigo: "CIT-01026",
    dia: "LUN",
    fechaNumero: "26",
    fechaEtiqueta: "Lunes 26 oct",
    horaInicio: "09:30",
    horarioCompleto: "09:30–10:00 · Consultorio 1",
    mascota: "Luna",
    servicio: "Consulta general",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "María García López",
    telefono: "987 654 321",
    estado: "En espera",
    tipoEstado: "pendiente",
    filaSlot: "slot-0930"
  },
  {
    id: 2,
    codigo: "CIT-01027",
    dia: "LUN",
    fechaNumero: "26",
    fechaEtiqueta: "Lunes 26 oct",
    horaInicio: "10:30",
    horarioCompleto: "10:30–11:00 · Consultorio 1",
    mascota: "Kira",
    servicio: "Control",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Elena Rojas Pérez",
    telefono: "944 820 156",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1030"
  },
  {
    id: 3,
    codigo: "CIT-01028",
    dia: "LUN",
    fechaNumero: "26",
    fechaEtiqueta: "Lunes 26 oct",
    horaInicio: "12:00",
    horarioCompleto: "12:00–12:30 · Consultorio 2",
    mascota: "Bruno",
    servicio: "Vacunación",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Diego Castro León",
    telefono: "975 014 288",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1200"
  },
  {
    id: 4,
    codigo: "CIT-01029",
    dia: "LUN",
    fechaNumero: "26",
    fechaEtiqueta: "Lunes 26 oct",
    horaInicio: "14:00",
    horarioCompleto: "14:00–14:30 · Consultorio 1",
    mascota: "Coco",
    servicio: "Control",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Paula Flores Vega",
    telefono: "960 258 147",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1400"
  },
  {
    id: 5,
    codigo: "CIT-01030",
    dia: "MAR",
    fechaNumero: "27",
    fechaEtiqueta: "Martes 27 oct",
    horaInicio: "09:00",
    horarioCompleto: "09:00–09:30 · Consultorio 1",
    mascota: "Milo",
    servicio: "Control",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Carlos Mendoza Ruiz",
    telefono: "956 123 480",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-0900"
  },
  {
    id: 6,
    codigo: "CIT-01031",
    dia: "MAR",
    fechaNumero: "27",
    fechaEtiqueta: "Martes 27 oct",
    horaInicio: "11:00",
    horarioCompleto: "11:00–11:30 · Consultorio 1",
    mascota: "Nala",
    servicio: "Vacunación",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Paula Flores Vega",
    telefono: "960 258 147",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1100"
  },
  {
    id: 7,
    codigo: "CIT-01032",
    dia: "MAR",
    fechaNumero: "27",
    fechaEtiqueta: "Martes 27 oct",
    horaInicio: "13:00",
    horarioCompleto: "13:00–13:30 · Consultorio 2",
    mascota: "Simba",
    servicio: "Consulta",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Rosa Torres Silva",
    telefono: "988 621 354",
    estado: "Pendiente",
    tipoEstado: "pendiente",
    filaSlot: "slot-1300"
  },
  {
    id: 8,
    codigo: "CIT-01033",
    dia: "MIÉ",
    fechaNumero: "28",
    fechaEtiqueta: "Miércoles 28 oct",
    horaInicio: "09:30",
    horarioCompleto: "09:30–10:00 · Consultorio 1",
    mascota: "Toby",
    servicio: "Consulta",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Diego Castro León",
    telefono: "975 014 288",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-0930"
  },
  {
    id: 9,
    codigo: "CIT-01034",
    dia: "MIÉ",
    fechaNumero: "28",
    fechaEtiqueta: "Miércoles 28 oct",
    horaInicio: "11:30",
    horarioCompleto: "11:30–12:00 · Consultorio 1",
    mascota: "Rocky",
    servicio: "Control",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Jorge Salazar Díaz",
    telefono: "998 412 300",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1130"
  },
  {
    id: 10,
    codigo: "CIT-01035",
    dia: "MIÉ",
    fechaNumero: "28",
    fechaEtiqueta: "Miércoles 28 oct",
    horaInicio: "13:30",
    horarioCompleto: "13:30–14:00 · Consultorio 2",
    mascota: "Kira",
    servicio: "Vacunación",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Elena Rojas Pérez",
    telefono: "944 820 156",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1330"
  },
  {
    id: 11,
    codigo: "CIT-01036",
    dia: "JUE",
    fechaNumero: "29",
    fechaEtiqueta: "Jueves 29 oct",
    horaInicio: "10:00",
    horarioCompleto: "10:00–10:30 · Consultorio 1",
    mascota: "Nala",
    servicio: "Consulta",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Paula Flores Vega",
    telefono: "960 258 147",
    estado: "Pendiente",
    tipoEstado: "pendiente",
    filaSlot: "slot-1000"
  },
  {
    id: 12,
    codigo: "CIT-01037",
    dia: "JUE",
    fechaNumero: "29",
    fechaEtiqueta: "Jueves 29 oct",
    horaInicio: "12:00",
    horarioCompleto: "12:00–12:30 · Consultorio 1",
    mascota: "Milo",
    servicio: "Control",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Carlos Mendoza Ruiz",
    telefono: "956 123 480",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1200"
  },
  {
    id: 13,
    codigo: "CIT-01038",
    dia: "JUE",
    fechaNumero: "29",
    fechaEtiqueta: "Jueves 29 oct",
    horaInicio: "14:00",
    horarioCompleto: "14:00–14:30 · Consultorio 2",
    mascota: "Toby",
    servicio: "Vacunación",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Diego Castro León",
    telefono: "975 014 288",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1400"
  },
  {
    id: 14,
    codigo: "CIT-01039",
    dia: "VIE",
    fechaNumero: "30",
    fechaEtiqueta: "Viernes 30 oct",
    horaInicio: "09:00",
    horarioCompleto: "09:00–09:30 · Consultorio 1",
    mascota: "Coco",
    servicio: "Control",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Paula Flores Vega",
    telefono: "960 258 147",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-0900"
  },
  {
    id: 15,
    codigo: "CIT-01040",
    dia: "VIE",
    fechaNumero: "30",
    fechaEtiqueta: "Viernes 30 oct",
    horaInicio: "11:00",
    horarioCompleto: "11:00–11:30 · Consultorio 1",
    mascota: "Bruno",
    servicio: "Consulta",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "Diego Castro León",
    telefono: "975 014 288",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1100"
  },
  {
    id: 16,
    codigo: "CIT-01041",
    dia: "VIE",
    fechaNumero: "30",
    fechaEtiqueta: "Viernes 30 oct",
    horaInicio: "13:00",
    horarioCompleto: "13:00–13:30 · Consultorio 2",
    mascota: "Luna",
    servicio: "Control",
    profesional: "Dra. Ana Martínez",
    profesionalCorto: "Dra. Ana M.",
    propietaria: "María García López",
    telefono: "987 654 321",
    estado: "Confirmada",
    tipoEstado: "confirmada",
    filaSlot: "slot-1300"
  }
];

const diasSemana = [
  { codigo: "LUN", numero: "26", esHoy: true },
  { codigo: "MAR", numero: "27", esHoy: false },
  { codigo: "MIÉ", numero: "28", esHoy: false },
  { codigo: "JUE", numero: "29", esHoy: false },
  { codigo: "VIE", numero: "30", esHoy: false }
];

const filasHoras = [
  { id: "slot-0900", etiqueta: "09:00" },
  { id: "slot-0930", etiqueta: "" },
  { id: "slot-1000", etiqueta: "10:00" },
  { id: "slot-1030", etiqueta: "" },
  { id: "slot-1100", etiqueta: "11:00" },
  { id: "slot-1130", etiqueta: "" },
  { id: "slot-1200", etiqueta: "12:00" },
  { id: "slot-1300", etiqueta: "13:00" },
  { id: "slot-1330", etiqueta: "" },
  { id: "slot-1400", etiqueta: "14:00" }
];

export default function AgendaRecepcion() {
  const navigate = useNavigate();

  const [citas, setCitas] = useState(citasSemanaIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [rangoSemana, setRangoSemana] = useState("26–30 oct 2026");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroProfesional, setFiltroProfesional] = useState("todos");
  const [vistaCalendario, setVistaCalendario] = useState("Semana");
  const [citaSeleccionadaId, setCitaSeleccionadaId] = useState(
    citasSemanaIniciales[0].id
  );
  const [avisoSistema, setAvisoSistema] = useState("");

  const citasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return citas.filter((cita) => {
      const cumpleEstado =
        filtroEstado === "todos" ||
        cita.estado.toLowerCase() === filtroEstado.toLowerCase();

      const cumpleProfesional =
        filtroProfesional === "todos" || cita.profesional === filtroProfesional;

      const cumpleBusqueda =
        !termino ||
        cita.mascota.toLowerCase().includes(termino) ||
        cita.propietaria.toLowerCase().includes(termino) ||
        cita.servicio.toLowerCase().includes(termino) ||
        cita.codigo.toLowerCase().includes(termino);

      return cumpleEstado && cumpleProfesional && cumpleBusqueda;
    });
  }, [citas, busqueda, filtroEstado, filtroProfesional]);

  const citaActiva =
    citasFiltradas.find((c) => c.id === citaSeleccionadaId) ||
    citas.find((c) => c.id === citaSeleccionadaId) ||
    citas[0];

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
      setAvisoSistema("");
      return;
    }
    setAvisoSistema(`Sección "${id}" en preparación.`);
  }

  function manejarCancelarCita() {
    if (!citaActiva) return;
    setCitas((prev) =>
      prev.map((item) =>
        item.id === citaActiva.id
          ? { ...item, estado: "Cancelada", tipoEstado: "cancelada" }
          : item
      )
    );
    setAvisoSistema(
      `Cita ${citaActiva.codigo} de ${citaActiva.mascota} marcada como cancelada.`
    );
  }

  function manejarModificarCita() {
    if (!citaActiva) return;
    setAvisoSistema(
      `Editando cita ${citaActiva.codigo} de ${citaActiva.mascota} (${citaActiva.horarioCompleto}).`
    );
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Agenda / Agenda de citas"
      seccionActivaInicial="agenda"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="ag-header-row">
        <div>
          <h1 className="ag-title">Agenda de citas</h1>
          <p className="ag-subtitle">
            Organiza la atención y encuentra el mejor momento para cada paciente.
          </p>
        </div>

        <button
          type="button"
          className="ag-btn-primary"
          onClick={() =>
            navigate("/recepcionista/agenda/nueva")
          }
        >
          <span>+</span>
          <span>Programar cita</span>
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <section className="ag-filter-bar" aria-label="Filtros de agenda">
        <div className="ag-search-box">
          <span className="ag-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            placeholder="Buscar mascota, propietario o cita..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar mascota, propietario o cita"
          />
        </div>

        <div className="ag-selects">
          <select
            className="ag-select"
            value={rangoSemana}
            onChange={(e) => setRangoSemana(e.target.value)}
            aria-label="Seleccionar rango de semana"
          >
            <option value="26–30 oct 2026">26–30 oct 2026</option>
            <option value="2–6 nov 2026">2–6 nov 2026</option>
          </select>

          <select
            className="ag-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="Confirmada">Confirmada</option>
            <option value="En espera">En espera</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <select
            className="ag-select"
            value={filtroProfesional}
            onChange={(e) => setFiltroProfesional(e.target.value)}
            aria-label="Filtrar por profesional"
          >
            <option value="todos">Todos los profesionales</option>
            <option value="Dra. Ana Martínez">Dra. Ana Martínez</option>
          </select>
        </div>
      </section>

      {avisoSistema && (
        <div role="status" className="ag-toast">
          {avisoSistema}
        </div>
      )}

      {/* Grid principal: Calendario semanal izquierda + Cita seleccionada derecha */}
      <div className="ag-grid">
        <section className="ag-calendar-card" aria-label="Calendario semanal">
          {/* Cabecera del calendario */}
          <div className="ag-cal-top">
            <h2 className="ag-cal-range">26–30 de octubre, 2026</h2>

            <div className="ag-cal-nav-group">
              <button
                type="button"
                className="ag-nav-arrow"
                aria-label="Semana anterior"
                onClick={() => setAvisoSistema("Mostrando semana anterior.")}
              >
                ‹
              </button>
              <button
                type="button"
                className="ag-nav-today"
                onClick={() => setAvisoSistema("Centrado en hoy: lunes 26 de octubre.")}
              >
                Hoy
              </button>
              <button
                type="button"
                className="ag-nav-arrow"
                aria-label="Semana siguiente"
                onClick={() => setAvisoSistema("Mostrando semana siguiente.")}
              >
                ›
              </button>
            </div>
          </div>

          {/* Leyenda de estados y selector Día / Semana / Mes */}
          <div className="ag-cal-subbar">
            <div className="ag-legend-pills">
              <button
                type="button"
                className="ag-legend-confirmada"
                onClick={() =>
                  setFiltroEstado((prev) =>
                    prev === "Confirmada" ? "todos" : "Confirmada"
                  )
                }
              >
                Confirmada
              </button>
              <button
                type="button"
                className="ag-legend-pendiente"
                onClick={() =>
                  setFiltroEstado((prev) =>
                    prev === "Pendiente" ? "todos" : "Pendiente"
                  )
                }
              >
                Pendiente
              </button>
            </div>

            <div className="ag-view-switch" role="group" aria-label="Vista del calendario">
              {["Día", "Semana", "Mes"].map((modo) => (
                <button
                  key={modo}
                  type="button"
                  className={`ag-view-btn ${
                    vistaCalendario === modo ? "is-active" : ""
                  }`}
                  onClick={() => setVistaCalendario(modo)}
                >
                  {modo}
                </button>
              ))}
            </div>
          </div>

          {/* Cabecera de días LUN 26 .. VIE 30 */}
          <div className="ag-days-header">
            <div className="ag-hour-spacer" aria-hidden="true" />
            {diasSemana.map((dia) => (
              <div
                key={dia.codigo}
                className={`ag-day-col-head ${dia.esHoy ? "is-today" : ""}`}
              >
                <span className="ag-day-name">{dia.codigo}</span>
                <strong className="ag-day-num">{dia.numero}</strong>
              </div>
            ))}
          </div>

          {/* Grilla de horas y tarjetas de citas */}
          <div className="ag-matrix-body">
            {filasHoras.map((fila) => (
              <div key={fila.id} className="ag-matrix-row">
                <div className="ag-hour-label">{fila.etiqueta}</div>

                {diasSemana.map((dia) => {
                  const citasEnCelda = citasFiltradas.filter(
                    (c) => c.dia === dia.codigo && c.filaSlot === fila.id
                  );

                  return (
                    <div
                      key={`${fila.id}-${dia.codigo}`}
                      className={`ag-matrix-cell ${dia.esHoy ? "is-today" : ""}`}
                    >
                      {citasEnCelda.map((cita) => {
                        const esActiva = citaActiva?.id === cita.id;
                        return (
                          <button
                            key={cita.id}
                            type="button"
                            className={`ag-appt-chip is-${cita.tipoEstado} ${
                              esActiva ? "is-selected" : ""
                            }`}
                            onClick={() => setCitaSeleccionadaId(cita.id)}
                          >
                            <div className="ag-appt-title">
                              {cita.horaInicio} · {cita.mascota}
                            </div>
                            <div className="ag-appt-service">
                              {cita.servicio}
                            </div>
                            <div className="ag-appt-doc">
                              {cita.profesionalCorto}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Columna derecha: Cita seleccionada */}
        <aside className="ag-side-col" aria-label="Detalle de cita seleccionada">
          {citaActiva && (
            <section className="ag-detail-card">
              <h2 className="ag-detail-heading">Cita seleccionada</h2>
              <p className="ag-detail-code">
                {citaActiva.codigo} · {citaActiva.fechaEtiqueta}
              </p>

              <span className={`ag-detail-badge is-${citaActiva.tipoEstado}`}>
                {citaActiva.estado}
              </span>

              <div className="ag-detail-pet-row">
                <span className="ag-detail-pet-icon" aria-hidden="true">
                  🐾
                </span>
                <strong className="ag-detail-pet-name">
                  {citaActiva.mascota}
                </strong>
              </div>

              <div className="ag-detail-field">
                <span className="ag-detail-label">Horario</span>
                <strong className="ag-detail-value">
                  {citaActiva.horarioCompleto}
                </strong>
              </div>

              <div className="ag-detail-field">
                <span className="ag-detail-label">Propietaria</span>
                <strong className="ag-detail-value">
                  {citaActiva.propietaria}
                </strong>
              </div>

              <div className="ag-detail-field">
                <span className="ag-detail-label">Teléfono</span>
                <strong className="ag-detail-value">
                  {citaActiva.telefono}
                </strong>
              </div>

              <div className="ag-detail-field">
                <span className="ag-detail-label">Servicio</span>
                <strong className="ag-detail-value">
                  {citaActiva.servicio}
                </strong>
              </div>

              <div className="ag-detail-field">
                <span className="ag-detail-label">Profesional</span>
                <strong className="ag-detail-value">
                  {citaActiva.profesional}
                </strong>
              </div>

              <div className="ag-detail-actions">
                <button
                  type="button"
                  className="ag-btn-modify"
                  onClick={() => navigate("/recepcionista/agenda/gestionar")}
                >
                  <span>✎</span>
                  <span>Modificar cita</span>
                </button>

                <button
                  type="button"
                  className="ag-btn-cancel-appt"
                  onClick={manejarCancelarCita}
                >
                  Cancelar cita
                </button>
              </div>
            </section>
          )}

          <p className="ag-hours-note">
            Horario de atención: lunes a sábado, de 08:00 a 18:00.
          </p>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}