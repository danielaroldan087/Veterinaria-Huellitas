import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./InicioRecepcion.css";

const metricasDia = [
  {
    id: "citas",
    titulo: "Citas de hoy",
    valor: "18",
    detalle: "12 confirmadas · 4 pendientes · 2 canceladas"
  },
  {
    id: "espera",
    titulo: "En sala de espera",
    valor: "03",
    detalle: "Tiempo medio de espera: 8 min"
  },
  {
    id: "mascotas",
    titulo: "Mascotas registradas",
    valor: "842",
    detalle: "6 nuevas esta semana"
  },
  {
    id: "propietarios",
    titulo: "Propietarios activos",
    valor: "628",
    detalle: "4 nuevos esta semana"
  }
];

const proximasCitas = [
  {
    id: 1,
    hora: "09:30",
    mascota: "Luna",
    propietario: "María García",
    servicio: "Consulta general",
    estado: "En espera",
    tipoEstado: "espera"
  },
  {
    id: 2,
    hora: "10:00",
    mascota: "Milo",
    propietario: "Carlos Mendoza",
    servicio: "Vacunación",
    estado: "Confirmada",
    tipoEstado: "confirmada"
  },
  {
    id: 3,
    hora: "10:30",
    mascota: "Kira",
    propietario: "Elena Rojas",
    servicio: "Control",
    estado: "Confirmada",
    tipoEstado: "confirmada"
  },
  {
    id: 4,
    hora: "11:00",
    mascota: "Rocky",
    propietario: "Jorge Salazar",
    servicio: "Consulta general",
    estado: "Pendiente",
    tipoEstado: "pendiente"
  },
  {
    id: 5,
    hora: "11:30",
    mascota: "Nala",
    propietario: "Paula Flores",
    servicio: "Desparasitación",
    estado: "Confirmada",
    tipoEstado: "confirmada"
  }
];

function obtenerPrimerNombre(nombreCompleto = "") {
  const limpio = nombreCompleto.trim();
  if (!limpio) return "Sofía";
  return limpio.split(/\s+/)[0];
}

export default function InicioRecepcion() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const primerNombre = obtenerPrimerNombre(usuario?.nombre || "Sofía Ramírez");
  const [avisoAccion, setAvisoAccion] = useState("");

  function manejarAccionRapida(mensaje) {
    setAvisoAccion(mensaje);
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Inicio / Buen día, Sofía"
      seccionActivaInicial="inicio"
      onSeleccionarSeccion={(id) => {
        if (id === "inicio") {
          setAvisoAccion("");
        } else {
          setAvisoAccion(`Sección seleccionada: ${id} (vista en preparación).`);
        }
      }}
    >
      {/* Encabezado principal con botón de acción */}
      <div className="inicio-header-row">
        <div>
          <h1 className="inicio-title">Buen día, {primerNombre}</h1>
          <p className="inicio-subtitle">
            Todo listo para recibir nuevas huellitas. Así empieza tu jornada.
          </p>
        </div>

        <button
          type="button"
          className="inicio-btn-primary"
          onClick={() =>
            manejarAccionRapida("Abrir formulario para programar nueva cita.")
          }
        >
          <span>+</span>
          <span>Programar cita</span>
        </button>
      </div>

      {/* Banner destacado del día */}
      <section className="inicio-highlight-banner" aria-label="Resumen de jornada">
        <div className="inicio-highlight-left">
          <span className="inicio-sun-icon" aria-hidden="true">☀</span>
          <div>
            <strong>Hoy cuidamos de 18 pacientes</strong>
            <p>
              La próxima cita es de Luna a las 09:30 con la Dra. Ana Martínez.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inicio-btn-outline-light"
          onClick={() =>
            manejarAccionRapida("Navegando a la agenda completa del día.")
          }
        >
          <span>→</span>
          <span>Ver agenda del día</span>
        </button>
      </section>

      {avisoAccion && (
        <div role="status" className="inicio-toast">
          {avisoAccion}
        </div>
      )}

      {/* 4 Tarjetas de métricas */}
      <section className="inicio-stats-grid" aria-label="Métricas del día">
        {metricasDia.map((metrica) => (
          <article key={metrica.id} className="inicio-stat-card">
            <span className="inicio-stat-label">{metrica.titulo}</span>
            <strong className="inicio-stat-value">{metrica.valor}</strong>
            <span className="inicio-stat-meta">{metrica.detalle}</span>
          </article>
        ))}
      </section>

      {/* Grid inferior: Próximas citas + Accesos rápidos */}
      <div className="inicio-main-grid">
        <section className="inicio-card" aria-label="Próximas citas">
          <div className="inicio-card-top">
            <div>
              <h2>Próximas citas</h2>
              <p>Lunes, 26 de octubre · Turno de mañana</p>
            </div>

            <button
              type="button"
              className="inicio-btn-secondary"
              onClick={() =>
                manejarAccionRapida("Mostrando todas las citas programadas.")
              }
            >
              Ver todas
            </button>
          </div>

          <div className="inicio-table-wrap">
            <table className="inicio-table">
              <thead>
                <tr>
                  <th>HORA / MASCOTA</th>
                  <th>PROPIETARIO</th>
                  <th>SERVICIO</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {proximasCitas.map((cita) => (
                  <tr key={cita.id}>
                    <td className="inicio-td-pet">
                      <strong>{cita.hora}</strong>
                      <span>·</span>
                      <strong>{cita.mascota}</strong>
                    </td>
                    <td>{cita.propietario}</td>
                    <td>{cita.servicio}</td>
                    <td>
                      <span className={`inicio-badge is-${cita.tipoEstado}`}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="inicio-side-col">
          <section className="inicio-card" aria-label="Accesos rápidos">
            <h2>Accesos rápidos</h2>

            <div className="inicio-quick-list">
              <button
                type="button"
                className="inicio-quick-item"
                onClick={() =>
                  manejarAccionRapida("Abrir registro de nuevo propietario.")
                }
              >
                <span className="inicio-quick-left">
                  <span aria-hidden="true">👤+</span>
                  <span>Registrar propietario</span>
                </span>
                <span className="inicio-quick-arrow" aria-hidden="true">↗</span>
              </button>

              <button
                type="button"
                className="inicio-quick-item"
                onClick={() =>
                  manejarAccionRapida("Abrir registro de nueva mascota.")
                }
              >
                <span className="inicio-quick-left">
                  <span aria-hidden="true">🐾</span>
                  <span>Registrar mascota</span>
                </span>
                <span className="inicio-quick-arrow" aria-hidden="true">↗</span>
              </button>

              <button
                type="button"
                className="inicio-quick-item"
                onClick={() =>
                  manejarAccionRapida("Abrir buscador general de registros.")
                }
              >
                <span className="inicio-quick-left">
                  <span aria-hidden="true">🔍</span>
                  <span>Buscar un registro</span>
                </span>
                <span className="inicio-quick-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
          </section>

          <div className="inicio-reminder-card" role="note">
            <span className="inicio-reminder-icon" aria-hidden="true">i</span>
            <div>
              <strong>4 citas por confirmar</strong>
              <p>Contacta a los propietarios antes de su visita.</p>
            </div>
          </div>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}