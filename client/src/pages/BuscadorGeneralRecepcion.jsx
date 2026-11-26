import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./BuscadorGeneralRecepcion.css";

const resultadosPropietarios = [
  {
    id: 1,
    nombre: "María García López",
    documento: "DNI 45872136",
    telefono: "987 654 321",
    correo: "maria.garcia@gmail.com",
    estado: "Activo",
    textoBusqueda:
      "maría garcía lópez 45872136 987 654 321 maria.garcia@gmail.com luna"
  }
];

const resultadosMascotas = [
  {
    id: 1,
    nombre: "Luna",
    codigo: "PAC-00128",
    especie: "Canino",
    raza: "Golden retriever",
    propietaria: "María García López",
    textoBusqueda:
      "luna pac-00128 canino golden retriever maría garcía lópez 45872136"
  }
];

const resultadosCitas = [
  {
    id: 1,
    codigo: "CIT-01026",
    fechaHora: "26 oct 2026 · 09:30",
    servicio: "Consulta general",
    estado: "En espera",
    tipoEstado: "espera",
    accionTexto: "Ver cita →",
    destino: "/recepcionista/agenda/gestionar",
    textoBusqueda:
      "cit-01026 26 oct 2026 09:30 consulta general en espera luna maría garcía"
  },
  {
    id: 2,
    codigo: "CIT-00940",
    fechaHora: "10 sep 2026 · 11:00",
    servicio: "Vacunación",
    estado: "Atendida",
    tipoEstado: "atendida",
    accionTexto: "Ver atención →",
    destino: "/recepcionista/agenda",
    textoBusqueda:
      "cit-00940 10 sep 2026 11:00 vacunación atendida luna maría garcía"
  },
  {
    id: 3,
    codigo: "CIT-00812",
    fechaHora: "15 jun 2026 · 10:00",
    servicio: "Control",
    estado: "Atendida",
    tipoEstado: "atendida",
    accionTexto: "Ver atención →",
    destino: "/recepcionista/agenda",
    textoBusqueda:
      "cit-00812 15 jun 2026 10:00 control atendida luna maría garcía"
  }
];

const busquedasRecientesIniciales = [
  "Luna",
  "987 654 321",
  "Carlos Mendoza"
];

export default function BuscadorGeneralRecepcion() {
  const navigate = useNavigate();

  const [consultaInput, setConsultaInput] = useState("María García");
  const [terminoActivo, setTerminoActivo] = useState("María García");
  const [campoFiltro, setCampoFiltro] = useState("cualquier");
  const [pestanaActiva, setPestanaActiva] = useState("todos");
  const [recientes, setRecientes] = useState(busquedasRecientesIniciales);
  const [avisoSistema, setAvisoSistema] = useState("");

  const filtrados = useMemo(() => {
    const limpio = terminoActivo.trim().toLowerCase();

    const coincide = (texto) => {
      if (!limpio) return true;
      if (campoFiltro === "codigo") {
        return texto.includes(limpio);
      }
      return texto.includes(limpio);
    };

    const props = resultadosPropietarios.filter((item) =>
      coincide(item.textoBusqueda)
    );
    const pets = resultadosMascotas.filter((item) =>
      coincide(item.textoBusqueda)
    );
    const appts = resultadosCitas.filter((item) =>
      coincide(item.textoBusqueda)
    );

    return {
      props,
      pets,
      appts,
      total: props.length + pets.length + appts.length
    };
  }, [terminoActivo, campoFiltro]);

  function ejecutarBusqueda(valor) {
    const texto = valor.trim();
    setConsultaInput(texto);
    setTerminoActivo(texto);
    setAvisoSistema("");

    if (texto) {
      setRecientes((prev) => [
        texto,
        ...prev.filter((item) => item.toLowerCase() !== texto.toLowerCase())
      ].slice(0, 5));
    }
  }

  function manejarSubmitBusqueda(evento) {
    evento.preventDefault();
    ejecutarBusqueda(consultaInput);
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
    if (id === "buscador") {
      setAvisoSistema("");
      return;
    }
    setAvisoSistema(`Sección "${id}" en preparación.`);
  }

  const mostrarPropietarios =
    (pestanaActiva === "todos" || pestanaActiva === "propietarios") &&
    filtrados.props.length > 0;

  const mostrarMascotas =
    (pestanaActiva === "todos" || pestanaActiva === "mascotas") &&
    filtrados.pets.length > 0;

  const mostrarCitas =
    (pestanaActiva === "todos" || pestanaActiva === "citas") &&
    filtrados.appts.length > 0;

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Buscador general / Buscador general"
      seccionActivaInicial="buscador"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="bg-header-block">
        <h1 className="bg-title">Buscador general</h1>
        <p className="bg-subtitle">
          Encuentra propietarios, mascotas y citas desde un único lugar.
        </p>
      </div>

      {/* Barra de búsqueda */}
      <form className="bg-search-bar" onSubmit={manejarSubmitBusqueda}>
        <div className="bg-input-wrap">
          <span className="bg-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            value={consultaInput}
            onChange={(e) => {
              setConsultaInput(e.target.value);
              setTerminoActivo(e.target.value);
            }}
            placeholder="Buscar por nombre, documento, teléfono, mascota o cita..."
            aria-label="Buscar por nombre, documento, teléfono, mascota o cita"
          />
        </div>

        <select
          className="bg-field-select"
          value={campoFiltro}
          onChange={(e) => setCampoFiltro(e.target.value)}
          aria-label="Filtrar por tipo de dato"
        >
          <option value="cualquier">Cualquier dato</option>
          <option value="documento">Documento / teléfono</option>
          <option value="mascota">Mascota</option>
          <option value="codigo">Código de cita</option>
        </select>

        <button type="submit" className="bg-btn-search">
          <span>🔍</span>
          <span>Buscar</span>
        </button>
      </form>

      {/* Pestañas de resultados */}
      <div className="bg-tabs" role="tablist" aria-label="Categorías de resultados">
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === "todos"}
          className={`bg-tab ${pestanaActiva === "todos" ? "is-active" : ""}`}
          onClick={() => setPestanaActiva("todos")}
        >
          Todos · {filtrados.total}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === "propietarios"}
          className={`bg-tab ${
            pestanaActiva === "propietarios" ? "is-active" : ""
          }`}
          onClick={() => setPestanaActiva("propietarios")}
        >
          Propietarios · {filtrados.props.length}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === "mascotas"}
          className={`bg-tab ${pestanaActiva === "mascotas" ? "is-active" : ""}`}
          onClick={() => setPestanaActiva("mascotas")}
        >
          Mascotas · {filtrados.pets.length}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === "citas"}
          className={`bg-tab ${pestanaActiva === "citas" ? "is-active" : ""}`}
          onClick={() => setPestanaActiva("citas")}
        >
          Citas · {filtrados.appts.length}
        </button>
      </div>

      {/* Resumen de coincidencias */}
      <p className="bg-summary-line">
        {filtrados.total} resultados para “{terminoActivo || "todos"}
        ” · Coincidencias en nombre, documento y datos asociados
      </p>

      {avisoSistema && (
        <div role="status" className="bg-toast">
          {avisoSistema}
        </div>
      )}

      {/* Grid principal: Resultados izquierda + Ayuda y recientes derecha */}
      <div className="bg-grid">
        <div className="bg-results-col">
          {/* Bloque Propietarios */}
          {mostrarPropietarios && (
            <section className="bg-card" aria-label="Resultados de propietarios">
              <div className="bg-card-top">
                <div>
                  <h2>Propietarios</h2>
                  <p>
                    {filtrados.props.length}{" "}
                    {filtrados.props.length === 1
                      ? "coincidencia"
                      : "coincidencias"}
                  </p>
                </div>
                <span className="bg-group-icon" aria-hidden="true">
                  👥
                </span>
              </div>

              {filtrados.props.map((prop) => (
                <div key={prop.id} className="bg-owner-row">
                  <div>
                    <div className="bg-entity-title">{prop.nombre}</div>
                    <div className="bg-entity-meta">
                      {prop.documento} · {prop.telefono} · {prop.correo}
                    </div>
                  </div>

                  <div className="bg-owner-right">
                    <span className="bg-active-pill">{prop.estado}</span>
                    <button
                      type="button"
                      className="bg-btn-outline"
                      onClick={() => navigate("/recepcionista/propietarios")}
                    >
                      Ver propietario
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Bloque Mascotas */}
          {mostrarMascotas && (
            <section className="bg-card" aria-label="Resultados de mascotas">
              <div className="bg-card-top">
                <div>
                  <h2>Mascotas</h2>
                  <p>
                    {filtrados.pets.length}{" "}
                    {filtrados.pets.length === 1
                      ? "paciente asociado"
                      : "pacientes asociados"}
                  </p>
                </div>
                <span className="bg-group-icon" aria-hidden="true">
                  🐾
                </span>
              </div>

              {filtrados.pets.map((pet) => (
                <div key={pet.id} className="bg-pet-row">
                  <div>
                    <div className="bg-entity-title">
                      {pet.nombre} · {pet.codigo}
                    </div>
                    <div className="bg-entity-meta">
                      {pet.especie} · {pet.raza} · Propietaria: {pet.propietaria}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="bg-btn-outline"
                    onClick={() => navigate("/recepcionista/mascotas")}
                  >
                    Ver ficha
                  </button>
                </div>
              ))}
            </section>
          )}

          {/* Bloque Citas */}
          {mostrarCitas && (
            <section className="bg-card" aria-label="Resultados de citas">
              <div className="bg-card-top">
                <div>
                  <h2>Citas</h2>
                  <p>
                    {filtrados.appts.length}{" "}
                    {filtrados.appts.length === 1
                      ? "visita asociada"
                      : "visitas asociadas"}
                  </p>
                </div>
              </div>

              <div className="bg-table-wrap">
                <table className="bg-table">
                  <thead>
                    <tr>
                      <th>FECHA / HORA</th>
                      <th>SERVICIO</th>
                      <th>ESTADO</th>
                      <th>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.appts.map((cita) => (
                      <tr key={cita.id}>
                        <td className="bg-td-strong">{cita.fechaHora}</td>
                        <td>{cita.servicio}</td>
                        <td>
                          <span className={`bg-status-pill is-${cita.tipoEstado}`}>
                            {cita.estado}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="bg-link-action"
                            onClick={() => navigate(cita.destino)}
                          >
                            {cita.accionTexto}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {!mostrarPropietarios && !mostrarMascotas && !mostrarCitas && (
            <section className="bg-card">
              <p className="bg-empty-msg">
                No se encontraron coincidencias para “{terminoActivo}
                ”. Prueba con otro nombre, DNI o código.
              </p>
            </section>
          )}
        </div>

        {/* Columna lateral derecha */}
        <aside className="bg-side-col" aria-label="Ayuda y búsquedas recientes">
          <section className="bg-card">
            <h2>Busca por cualquier dato</h2>
            <div className="bg-scan-icon" aria-hidden="true">
              ⛶
            </div>

            <p className="bg-side-desc">
              Puedes utilizar el nombre, teléfono, correo, documento o código de
              una cita o mascota.
            </p>

            <div className="bg-examples-block">
              <span className="bg-examples-label">Ejemplos de búsqueda</span>
              <strong className="bg-examples-val">
                Luna · 45872136 · CIT-01026
              </strong>
            </div>

            <p className="bg-side-footnote">
              Los resultados respetan los permisos de tu rol de Recepción.
            </p>
          </section>

          <section className="bg-card">
            <h2>Búsquedas recientes</h2>

            <div className="bg-recent-list">
              {recientes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="bg-recent-item"
                  onClick={() => ejecutarBusqueda(item)}
                >
                  <span className="bg-recent-arrow" aria-hidden="true">
                    ↶
                  </span>
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}