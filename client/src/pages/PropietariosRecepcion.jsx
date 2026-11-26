import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./PropietariosRecepcion.css";

const propietariosIniciales = [
  {
    id: 1,
    nombre: "María García López",
    documento: "DNI 45872136",
    tipoDoc: "DNI",
    telefono: "987 654 321",
    correo: "maria.garcia@gmail.com",
    mascota: "Luna",
    especie: "Canino",
    estado: "Activo"
  },
  {
    id: 2,
    nombre: "Carlos Mendoza Ruiz",
    documento: "DNI 70234518",
    tipoDoc: "DNI",
    telefono: "956 123 480",
    correo: "carlos.m@gmail.com",
    mascota: "Milo",
    especie: "Felino",
    estado: "Activo"
  },
  {
    id: 3,
    nombre: "Elena Rojas Pérez",
    documento: "DNI 41897265",
    tipoDoc: "DNI",
    telefono: "944 820 156",
    correo: "elena.rojas@gmail.com",
    mascota: "Kira",
    especie: "Canino",
    estado: "Activo"
  },
  {
    id: 4,
    nombre: "Jorge Salazar Díaz",
    documento: "DNI 60124893",
    tipoDoc: "DNI",
    telefono: "998 412 300",
    correo: "jorge.sd@gmail.com",
    mascota: "Rocky",
    especie: "Canino",
    estado: "Activo"
  },
  {
    id: 5,
    nombre: "Paula Flores Vega",
    documento: "DNI 73451290",
    tipoDoc: "DNI",
    telefono: "960 258 147",
    correo: "paula.f@gmail.com",
    mascota: "Nala",
    especie: "Felino",
    estado: "Activo"
  },
  {
    id: 6,
    nombre: "Diego Castro León",
    documento: "DNI 46901827",
    tipoDoc: "DNI",
    telefono: "975 014 288",
    correo: "diego.cl@gmail.com",
    mascota: "Toby",
    especie: "Canino",
    estado: "Activo"
  },
  {
    id: 7,
    nombre: "Rosa Torres Silva",
    documento: "DNI 40815279",
    tipoDoc: "DNI",
    telefono: "988 621 354",
    correo: "rosa.ts@gmail.com",
    mascota: "Simba",
    especie: "Felino",
    estado: "Inactivo"
  }
];

export default function PropietariosRecepcion() {
  const navigate = useNavigate();

  const [propietarios, setPropietarios] = useState(propietariosIniciales);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const [propietarioPendienteBaja, setPropietarioPendienteBaja] = useState(
    propietariosIniciales[5]
  );
  const [avisoSistema, setAvisoSistema] = useState("");

  const totalTodos = 641;
  const totalActivos = 628;
  const totalInactivos = 13;

  const propietariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return propietarios.filter((item) => {
      const cumpleEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && item.estado === "Activo") ||
        (filtroEstado === "inactivos" && item.estado === "Inactivo");

      const cumpleDocumento =
        filtroDocumento === "todos" || item.tipoDoc === filtroDocumento;

      const cumpleBusqueda =
        !termino ||
        item.nombre.toLowerCase().includes(termino) ||
        item.documento.toLowerCase().includes(termino) ||
        item.telefono.toLowerCase().includes(termino) ||
        item.correo.toLowerCase().includes(termino) ||
        item.mascota.toLowerCase().includes(termino);

      return cumpleEstado && cumpleDocumento && cumpleBusqueda;
    });
  }, [propietarios, filtroEstado, filtroDocumento, busqueda]);

  function manejarSeleccionSeccion(id) {
    if (id === "inicio") {
      navigate("/recepcionista/inicio");
      return;
    }
    if (id === "propietarios") {
      setAvisoSistema("");
      return;
    }
    setAvisoSistema(`Sección "${id}" en preparación.`);
  }

  function manejarSolicitarDesactivar(propietario) {
    setPropietarioPendienteBaja(propietario);
    setAvisoSistema("");
  }

  function manejarConfirmarDesactivacion() {
    if (!propietarioPendienteBaja) return;

    const objetivoId = propietarioPendienteBaja.id;
    const nombreObjetivo = propietarioPendienteBaja.nombre;

    setPropietarios((prev) =>
      prev.map((item) =>
        item.id === objetivoId ? { ...item, estado: "Inactivo" } : item
      )
    );
    setPropietarioPendienteBaja(null);
    setAvisoSistema(`Se desactivó a ${nombreObjetivo}.`);
  }

  function manejarActivarPropietario(propietario) {
    setPropietarios((prev) =>
      prev.map((item) =>
        item.id === propietario.id ? { ...item, estado: "Activo" } : item
      )
    );
    if (propietarioPendienteBaja?.id === propietario.id) {
      setPropietarioPendienteBaja(null);
    }
    setAvisoSistema(`Se activó nuevamente a ${propietario.nombre}.`);
  }

  function manejarExportar() {
    setAvisoSistema(
      `Exportando ${propietariosFiltrados.length} registro(s) de propietarios...`
    );
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Propietarios / Propietarios"
      seccionActivaInicial="propietarios"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="prop-header-row">
        <div>
          <h1 className="prop-title">Propietarios</h1>
          <p className="prop-subtitle">
            Las familias detrás de cada paciente. Gestiona sus datos y mascotas
            asociadas.
          </p>
        </div>

        <button
          type="button"
          className="prop-btn-primary"
          onClick={() => navigate("/recepcionista/propietarios/nuevo")
          }
        >
          <span>👤+</span>
          <span>Registrar propietario</span>
        </button>
      </div>

      {/* Pestañas de estado */}
      <div className="prop-tabs" role="tablist" aria-label="Filtrar propietarios">
        <button
          type="button"
          role="tab"
          aria-selected={filtroEstado === "todos"}
          className={`prop-tab ${filtroEstado === "todos" ? "is-active" : ""}`}
          onClick={() => {
            setFiltroEstado("todos");
            setPaginaActual(1);
          }}
        >
          Todos · {totalTodos}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filtroEstado === "activos"}
          className={`prop-tab ${filtroEstado === "activos" ? "is-active" : ""}`}
          onClick={() => {
            setFiltroEstado("activos");
            setPaginaActual(1);
          }}
        >
          Activos · {totalActivos}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filtroEstado === "inactivos"}
          className={`prop-tab ${
            filtroEstado === "inactivos" ? "is-active" : ""
          }`}
          onClick={() => {
            setFiltroEstado("inactivos");
            setPaginaActual(1);
          }}
        >
          Inactivos · {totalInactivos}
        </button>
      </div>

      {avisoSistema && (
        <div role="status" className="prop-toast">
          {avisoSistema}
        </div>
      )}

      {/* Tarjeta principal de búsqueda y tabla */}
      <section className="prop-card" aria-label="Listado de propietarios">
        <div className="prop-toolbar">
          <div className="prop-search-box">
            <span className="prop-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              placeholder="Buscar por nombre, documento o teléfono..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              aria-label="Buscar por nombre, documento o teléfono"
            />
          </div>

          <div className="prop-toolbar-actions">
            <select
              className="prop-select"
              value={filtroDocumento}
              onChange={(e) => {
                setFiltroDocumento(e.target.value);
                setPaginaActual(1);
              }}
              aria-label="Filtrar por tipo de documento"
            >
              <option value="todos">Todos los documentos</option>
              <option value="DNI">DNI</option>
              <option value="CE">Carné de extranjería</option>
              <option value="PAS">Pasaporte</option>
            </select>

            <button
              type="button"
              className="prop-btn-secondary"
              onClick={manejarExportar}
            >
              <span>↓</span>
              <span>Exportar</span>
            </button>
          </div>
        </div>

        <div className="prop-table-wrap">
          <table className="prop-table">
            <thead>
              <tr>
                <th>PROPIETARIO / DOCUMENTO</th>
                <th>CONTACTO</th>
                <th>MASCOTAS</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {propietariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="prop-empty-cell">
                    No se encontraron propietarios con los filtros actuales.
                  </td>
                </tr>
              ) : (
                propietariosFiltrados.map((item) => {
                  const estaActivo = item.estado === "Activo";
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="prop-primary-text">{item.nombre}</div>
                        <div className="prop-secondary-text">
                          {item.documento}
                        </div>
                      </td>
                      <td>
                        <div className="prop-contact-phone">{item.telefono}</div>
                        <div className="prop-secondary-text">{item.correo}</div>
                      </td>
                      <td>
                        <span className="prop-pet-text">
                          {item.mascota} · {item.especie}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`prop-status-badge ${
                            estaActivo ? "is-activo" : "is-inactivo"
                          }`}
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td>
                        <div className="prop-actions-cell">
                          <button
                            type="button"
                            className="prop-action-link is-view"
                            onClick={() =>
                              setAvisoSistema(`Viendo ficha de ${item.nombre}.`)
                            }
                          >
                            Ver
                          </button>
                          <span className="prop-dot">·</span>
                          <button
                            type="button"
                            className="prop-action-link"
                            onClick={() =>
                              setAvisoSistema(`Editando datos de ${item.nombre}.`)
                            }
                          >
                            Editar
                          </button>
                          <span className="prop-dot">·</span>
                          {estaActivo ? (
                            <button
                              type="button"
                              className="prop-action-link"
                              onClick={() => manejarSolicitarDesactivar(item)}
                            >
                              Desactivar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="prop-action-link"
                              onClick={() => manejarActivarPropietario(item)}
                            >
                              Activar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla: contador y paginación */}
        <div className="prop-table-footer">
          <span className="prop-count-text">
            Mostrando 1–{propietariosFiltrados.length} de {totalTodos}{" "}
            propietarios
          </span>

          <div className="prop-pagination">
            <button
              type="button"
              className="prop-page-btn"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            >
              ‹ Anterior
            </button>
            <button
              type="button"
              className={`prop-page-num ${paginaActual === 1 ? "is-active" : ""}`}
              onClick={() => setPaginaActual(1)}
            >
              1
            </button>
            <button
              type="button"
              className={`prop-page-num ${paginaActual === 2 ? "is-active" : ""}`}
              onClick={() => setPaginaActual(2)}
            >
              2
            </button>
            <button
              type="button"
              className="prop-page-btn"
              onClick={() => setPaginaActual((p) => p + 1)}
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </section>

      {/* Banner inferior de confirmación de desactivación */}
      {propietarioPendienteBaja && (
        <section
          className="prop-confirm-banner"
          aria-label="Confirmar desactivación"
        >
          <div className="prop-confirm-left">
            <span className="prop-confirm-icon" aria-hidden="true">
              !
            </span>
            <div>
              <strong>Desactivar a {propietarioPendienteBaja.nombre}</strong>
              <p>
                Sus datos e historial se conservarán. No se podrán programar
                nuevas citas mientras esté inactivo.
              </p>
            </div>
          </div>

          <div className="prop-confirm-actions">
            <button
              type="button"
              className="prop-btn-cancel-soft"
              onClick={() => setPropietarioPendienteBaja(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="prop-btn-danger-soft"
              onClick={manejarConfirmarDesactivacion}
            >
              Confirmar desactivación
            </button>
          </div>
        </section>
      )}
    </LayoutRecepcion>
  );
}