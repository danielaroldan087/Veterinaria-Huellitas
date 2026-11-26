import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./MascotasRecepcion.css";

const mascotasIniciales = [
  {
    id: 1,
    nombre: "Luna",
    codigo: "PAC-00128",
    propietario: "María García López",
    documento: "DNI 45872136",
    telefono: "987 654 321",
    especie: "Canino",
    edad: "3 años",
    raza: "Golden retriever",
    sexo: "Hembra",
    ultimaVisita: "26 oct 2026",
    totalMascotasPropietario: 1
  },
  {
    id: 2,
    nombre: "Milo",
    codigo: "PAC-00204",
    propietario: "Carlos Mendoza Ruiz",
    documento: "DNI 70234518",
    telefono: "956 123 480",
    especie: "Felino",
    edad: "2 años",
    raza: "Doméstico pelo corto",
    sexo: "Macho",
    ultimaVisita: "22 oct 2026",
    totalMascotasPropietario: 1
  },
  {
    id: 3,
    nombre: "Kira",
    codigo: "PAC-00189",
    propietario: "Elena Rojas Pérez",
    documento: "DNI 41897265",
    telefono: "944 820 156",
    especie: "Canino",
    edad: "5 años",
    raza: "Beagle",
    sexo: "Hembra",
    ultimaVisita: "19 oct 2026",
    totalMascotasPropietario: 1
  },
  {
    id: 4,
    nombre: "Rocky",
    codigo: "PAC-00316",
    propietario: "Jorge Salazar Díaz",
    documento: "DNI 60124893",
    telefono: "998 412 300",
    especie: "Canino",
    edad: "4 años",
    raza: "Schnauzer",
    sexo: "Macho",
    ultimaVisita: "18 oct 2026",
    totalMascotasPropietario: 1
  },
  {
    id: 5,
    nombre: "Nala",
    codigo: "PAC-00402",
    propietario: "Paula Flores Vega",
    documento: "DNI 73451290",
    telefono: "960 258 147",
    especie: "Felino",
    edad: "1 año",
    raza: "Siamés",
    sexo: "Hembra",
    ultimaVisita: "15 oct 2026",
    totalMascotasPropietario: 1
  },
  {
    id: 6,
    nombre: "Toby",
    codigo: "PAC-00277",
    propietario: "Diego Castro León",
    documento: "DNI 46901827",
    telefono: "975 014 288",
    especie: "Canino",
    edad: "6 años",
    raza: "French bulldog",
    sexo: "Macho",
    ultimaVisita: "12 oct 2026",
    totalMascotasPropietario: 1
  },
  {
    id: 7,
    nombre: "Simba",
    codigo: "PAC-00163",
    propietario: "Rosa Torres Silva",
    documento: "DNI 40815279",
    telefono: "988 621 354",
    especie: "Felino",
    edad: "4 años",
    raza: "Persa",
    sexo: "Macho",
    ultimaVisita: "10 oct 2026",
    totalMascotasPropietario: 1
  }
];

export default function MascotasRecepcion() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEspecie, setFiltroEspecie] = useState("todas");
  const [filtroPropietario, setFiltroPropietario] = useState("todos");
  const [mascotaSeleccionadaId, setMascotaSeleccionadaId] = useState(
    mascotasIniciales[0].id
  );
  const [paginaActual, setPaginaActual] = useState(1);
  const [avisoSistema, setAvisoSistema] = useState("");

  const totalMascotas = 842;

  const listaPropietarios = useMemo(() => {
    return [...new Set(mascotasIniciales.map((item) => item.propietario))];
  }, []);

  const mascotasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return mascotasIniciales.filter((item) => {
      const cumpleEspecie =
        filtroEspecie === "todas" ||
        item.especie.toLowerCase() === filtroEspecie.toLowerCase();

      const cumplePropietario =
        filtroPropietario === "todos" || item.propietario === filtroPropietario;

      const cumpleBusqueda =
        !termino ||
        item.nombre.toLowerCase().includes(termino) ||
        item.codigo.toLowerCase().includes(termino) ||
        item.propietario.toLowerCase().includes(termino) ||
        item.especie.toLowerCase().includes(termino);

      return cumpleEspecie && cumplePropietario && cumpleBusqueda;
    });
  }, [busqueda, filtroEspecie, filtroPropietario]);

  const mascotaActiva =
    mascotasFiltradas.find((m) => m.id === mascotaSeleccionadaId) ||
    mascotasIniciales.find((m) => m.id === mascotaSeleccionadaId) ||
    mascotasIniciales[0];

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
      setAvisoSistema("");
      return;
    }
    setAvisoSistema(`Sección "${id}" en preparación.`);
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Mascotas / Mascotas"
      seccionActivaInicial="mascotas"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="masc-header-row">
        <div>
          <h1 className="masc-title">Mascotas</h1>
          <p className="masc-subtitle">
            Cada paciente tiene su historia. Encuentra su ficha y mantén sus
            datos al día.
          </p>
        </div>

        <button
          type="button"
          className="masc-btn-primary"
          onClick={() => navigate("/recepcionista/mascotas/nueva")
          }
        >
          <span>+</span>
          <span>Registrar mascota</span>
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <section className="masc-filter-bar" aria-label="Filtros de mascotas">
        <div className="masc-search-box">
          <span className="masc-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            placeholder="Buscar mascota, propietario o código..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            aria-label="Buscar mascota, propietario o código"
          />
        </div>

        <div className="masc-selects">
          <select
            className="masc-select"
            value={filtroEspecie}
            onChange={(e) => {
              setFiltroEspecie(e.target.value);
              setPaginaActual(1);
            }}
            aria-label="Filtrar por especie"
          >
            <option value="todas">Todas las especies</option>
            <option value="Canino">Canino</option>
            <option value="Felino">Felino</option>
          </select>

          <select
            className="masc-select"
            value={filtroPropietario}
            onChange={(e) => {
              setFiltroPropietario(e.target.value);
              setPaginaActual(1);
            }}
            aria-label="Filtrar por propietario"
          >
            <option value="todos">Todos los propietarios</option>
            {listaPropietarios.map((prop) => (
              <option key={prop} value={prop}>
                {prop}
              </option>
            ))}
          </select>
        </div>
      </section>

      {avisoSistema && (
        <div role="status" className="masc-toast">
          {avisoSistema}
        </div>
      )}

      {/* Grid principal: Tabla izquierda + Panel Por propietario derecha */}
      <div className="masc-grid">
        <section className="masc-card" aria-label="Pacientes registrados">
          <div className="masc-card-head">
            <h2>Pacientes registrados</h2>
            <p>
              {totalMascotas} mascotas · Orden: registro más reciente
            </p>
          </div>

          <div className="masc-table-wrap">
            <table className="masc-table">
              <thead>
                <tr>
                  <th>MASCOTA</th>
                  <th>PROPIETARIO</th>
                  <th>ESPECIE / EDAD</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {mascotasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="masc-empty-cell">
                      No se encontraron mascotas con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  mascotasFiltradas.map((mascota) => {
                    const esSeleccionada = mascota.id === mascotaActiva.id;
                    return (
                      <tr
                        key={mascota.id}
                        className={esSeleccionada ? "is-selected" : ""}
                        onClick={() => setMascotaSeleccionadaId(mascota.id)}
                      >
                        <td className="masc-td-pet">
                          <strong>{mascota.nombre}</strong>
                          <span>·</span>
                          <strong>{mascota.codigo}</strong>
                        </td>
                        <td>{mascota.propietario}</td>
                        <td>
                          {mascota.especie} · {mascota.edad}
                        </td>
                        <td>
                          <div className="masc-actions-cell">
                            <button
                              type="button"
                              className="masc-action-link is-view"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMascotaSeleccionadaId(mascota.id);
                                setAvisoSistema(
                                  `Abriendo ficha clínica de ${mascota.nombre} (${mascota.codigo}).`
                                );
                              }}
                            >
                              Ver ficha
                            </button>
                            <span className="masc-dot">·</span>
                            <button
                              type="button"
                              className="masc-action-link"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMascotaSeleccionadaId(mascota.id);
                                setAvisoSistema(
                                  `Editando datos de ${mascota.nombre}.`
                                );
                              }}
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="masc-table-footer">
            <span className="masc-count-text">
              1–{mascotasFiltradas.length} de {totalMascotas} mascotas
            </span>

            <div className="masc-pagination">
              <button
                type="button"
                className="masc-page-btn"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              >
                ‹ Anterior
              </button>
              <button
                type="button"
                className={`masc-page-num ${
                  paginaActual === 1 ? "is-active" : ""
                }`}
                onClick={() => setPaginaActual(1)}
              >
                1
              </button>
              <button
                type="button"
                className={`masc-page-num ${
                  paginaActual === 2 ? "is-active" : ""
                }`}
                onClick={() => setPaginaActual(2)}
              >
                2
              </button>
              <button
                type="button"
                className="masc-page-btn"
                onClick={() => setPaginaActual((p) => p + 1)}
              >
                Siguiente ›
              </button>
            </div>
          </div>
        </section>

        {/* Columna lateral derecha: Por propietario */}
        <aside className="masc-side-col" aria-label="Detalle por propietario">
          <section className="masc-card">
            <h2 className="masc-side-title">Por propietario</h2>
            <p className="masc-side-sub">Propietario seleccionado</p>

            <div className="masc-owner-row">
              <span className="masc-owner-avatar" aria-hidden="true">
                👤
              </span>
              <strong className="masc-owner-name">
                {mascotaActiva.propietario}
              </strong>
            </div>

            <div className="masc-meta-item">
              <span className="masc-meta-label">Documento</span>
              <strong className="masc-meta-value">
                {mascotaActiva.documento}
              </strong>
            </div>

            <div className="masc-meta-item">
              <span className="masc-meta-label">Contacto</span>
              <strong className="masc-meta-value">
                {mascotaActiva.telefono}
              </strong>
            </div>

            <div className="masc-pill-row">
              <span className="masc-count-pill">
                {mascotaActiva.totalMascotasPropietario} mascota asociada
              </span>
            </div>

            <div className="masc-pet-highlight">
              <div className="masc-pet-highlight-name">
                {mascotaActiva.nombre}
              </div>
              <div className="masc-pet-highlight-meta">
                {mascotaActiva.raza} · {mascotaActiva.sexo}
              </div>
              <div className="masc-pet-highlight-visit">
                Última visita: {mascotaActiva.ultimaVisita}
              </div>

              <button
                type="button"
                className="masc-btn-edit-pet"
                onClick={() =>
                  setAvisoSistema(
                    `Editando información de ${mascotaActiva.nombre}.`
                  )
                }
              >
                <span>✎</span>
                <span>Editar datos</span>
              </button>
            </div>

            <button
              type="button"
              className="masc-btn-add-pet"
              onClick={() =>
                setAvisoSistema(
                  `Añadir nueva mascota para ${mascotaActiva.propietario}.`
                )
              }
            >
              <span>+</span>
              <span>Añadir mascota</span>
            </button>
          </section>

          <p className="masc-side-help">
            Selecciona un propietario para consultar únicamente sus mascotas.
          </p>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}