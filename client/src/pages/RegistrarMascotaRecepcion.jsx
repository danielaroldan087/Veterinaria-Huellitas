import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./RegistrarMascotaRecepcion.css";

const propietariosDisponibles = [
  {
    id: 1,
    nombre: "María García López",
    documento: "DNI 45872136",
    telefono: "987 654 321",
    estado: "Propietaria activa"
  },
  {
    id: 2,
    nombre: "Carlos Mendoza Ruiz",
    documento: "DNI 70234518",
    telefono: "956 123 480",
    estado: "Propietario activo"
  },
  {
    id: 3,
    nombre: "Elena Rojas Pérez",
    documento: "DNI 41897265",
    telefono: "944 820 156",
    estado: "Propietaria activa"
  },
  {
    id: 4,
    nombre: "Jorge Salazar Díaz",
    documento: "DNI 60124893",
    telefono: "998 412 300",
    estado: "Propietario activo"
  }
];

const razasPorEspecie = {
  Canino: [
    "Golden retriever",
    "Labrador retriever",
    "Beagle",
    "Schnauzer",
    "French bulldog",
    "Mestizo"
  ],
  Felino: [
    "Doméstico pelo corto",
    "Siamés",
    "Persa",
    "Maine coon",
    "Mestizo"
  ]
};

export default function RegistrarMascotaRecepcion() {
  const navigate = useNavigate();

  const [nombreMascota, setNombreMascota] = useState("Luna");
  const [especie, setEspecie] = useState("Canino");
  const [raza, setRaza] = useState("Golden retriever");
  const [sexo, setSexo] = useState("Hembra");
  const [fechaNacimiento, setFechaNacimiento] = useState("15 / 04 / 2023");
  const [pesoKg, setPesoKg] = useState("28,4");
  const [esterilizacion, setEsterilizacion] = useState("Sí, esterilizada");
  const [colorSenias, setColorSenias] = useState("Dorado claro");
  const [alergias, setAlergias] = useState(
    "Penicilina: reacción cutánea reportada por la propietaria."
  );

  const [propietarioId, setPropietarioId] = useState(
    propietariosDisponibles[0].id
  );
  const [errorForm, setErrorForm] = useState("");
  const [exitoForm, setExitoForm] = useState("");

  const propietarioSeleccionado = useMemo(() => {
    return (
      propietariosDisponibles.find((p) => p.id === Number(propietarioId)) ||
      propietariosDisponibles[0]
    );
  }, [propietarioId]);

  function manejarVolverMascotas() {
    navigate("/recepcionista/mascotas");
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
    setExitoForm(`Sección "${id}" en preparación.`);
    setErrorForm("");
  }

  function manejarCambioEspecie(nuevaEspecie) {
    setEspecie(nuevaEspecie);
    const opcionesRaza = razasPorEspecie[nuevaEspecie] || [];
    if (!opcionesRaza.includes(raza)) {
      setRaza(opcionesRaza[0] || "");
    }
  }

  function manejarGuardarMascota(evento) {
    evento.preventDefault();
    setErrorForm("");
    setExitoForm("");

    if (
      !nombreMascota.trim() ||
      !especie.trim() ||
      !sexo.trim() ||
      !fechaNacimiento.trim() ||
      !pesoKg.trim()
    ) {
      setErrorForm("Completa todos los campos obligatorios (*).");
      return;
    }

    const pesoNormalizado = pesoKg.trim().replace(",", ".");
    if (Number.isNaN(Number(pesoNormalizado)) || Number(pesoNormalizado) <= 0) {
      setErrorForm("Ingresa un peso válido en kilogramos (ejemplo: 28,4).");
      return;
    }

    setExitoForm(
      `Mascota "${nombreMascota.trim()}" vinculada a ${propietarioSeleccionado.nombre} registrada correctamente.`
    );
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Mascotas / Registrar mascota"
      seccionActivaInicial="mascotas"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="reg-masc-header-row">
        <div>
          <h1 className="reg-masc-title">Registrar mascota</h1>
          <p className="reg-masc-subtitle">
            Abre una nueva historia de cuidado y vincúlala con su propietario.
          </p>
        </div>

        <button
          type="button"
          className="reg-masc-btn-back"
          onClick={manejarVolverMascotas}
        >
          <span>←</span>
          <span>Volver a mascotas</span>
        </button>
      </div>

      {/* Grid principal: Formulario izquierda + Propietario responsable derecha */}
      <div className="reg-masc-grid">
        <section className="reg-masc-card" aria-label="Datos generales">
          <div className="reg-masc-card-header">
            <h2>Datos generales</h2>
            <p>La información clínica podrá completarse durante la atención.</p>
          </div>

          <form
            className="reg-masc-form"
            onSubmit={manejarGuardarMascota}
            noValidate
          >
            <div className="reg-masc-two-cols">
              <div className="reg-masc-field">
                <label htmlFor="reg-masc-nombre">Nombre de la mascota *</label>
                <input
                  id="reg-masc-nombre"
                  type="text"
                  value={nombreMascota}
                  onChange={(e) => setNombreMascota(e.target.value)}
                />
              </div>

              <div className="reg-masc-field">
                <label htmlFor="reg-masc-especie">Especie *</label>
                <select
                  id="reg-masc-especie"
                  value={especie}
                  onChange={(e) => manejarCambioEspecie(e.target.value)}
                >
                  <option value="Canino">Canino</option>
                  <option value="Felino">Felino</option>
                </select>
              </div>
            </div>

            <div className="reg-masc-two-cols">
              <div className="reg-masc-field">
                <label htmlFor="reg-masc-raza">Raza</label>
                <select
                  id="reg-masc-raza"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                >
                  {(razasPorEspecie[especie] || []).map((itemRaza) => (
                    <option key={itemRaza} value={itemRaza}>
                      {itemRaza}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reg-masc-field">
                <label htmlFor="reg-masc-sexo">Sexo *</label>
                <select
                  id="reg-masc-sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                >
                  <option value="Hembra">Hembra</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>
            </div>

            <div className="reg-masc-two-cols">
              <div className="reg-masc-field">
                <label htmlFor="reg-masc-nacimiento">
                  Fecha de nacimiento *
                </label>
                <input
                  id="reg-masc-nacimiento"
                  type="text"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
                <span className="reg-masc-helper">
                  Edad calculada: 3 años y 6 meses
                </span>
              </div>

              <div className="reg-masc-field">
                <label htmlFor="reg-masc-peso">Peso actual (kg) *</label>
                <input
                  id="reg-masc-peso"
                  type="text"
                  value={pesoKg}
                  onChange={(e) => setPesoKg(e.target.value)}
                />
                <span className="reg-masc-helper">
                  Utiliza coma decimal. Ejemplo: 28,4
                </span>
              </div>
            </div>

            <div className="reg-masc-two-cols">
              <div className="reg-masc-field">
                <label htmlFor="reg-masc-esterilizacion">
                  Esterilización
                </label>
                <select
                  id="reg-masc-esterilizacion"
                  value={esterilizacion}
                  onChange={(e) => setEsterilizacion(e.target.value)}
                >
                  <option value="Sí, esterilizada">Sí, esterilizada</option>
                  <option value="Sí, esterilizado">Sí, esterilizado</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="reg-masc-field">
                <label htmlFor="reg-masc-color">
                  Color / señas particulares
                </label>
                <input
                  id="reg-masc-color"
                  type="text"
                  value={colorSenias}
                  onChange={(e) => setColorSenias(e.target.value)}
                />
              </div>
            </div>

            <div className="reg-masc-field">
              <label htmlFor="reg-masc-alergias">Alergias conocidas</label>
              <textarea
                id="reg-masc-alergias"
                rows="3"
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
              />
            </div>

            {errorForm && (
              <p role="alert" className="reg-masc-error">
                {errorForm}
              </p>
            )}
            {exitoForm && (
              <p role="status" className="reg-masc-success">
                {exitoForm}
              </p>
            )}

            <div className="reg-masc-form-footer">
              <span className="reg-masc-required-note">
                Los campos con * son obligatorios.
              </span>

              <div className="reg-masc-actions">
                <button
                  type="button"
                  className="reg-masc-btn-cancel"
                  onClick={manejarVolverMascotas}
                >
                  Cancelar
                </button>
                <button type="submit" className="reg-masc-btn-submit">
                  <span>✓</span>
                  <span>Guardar mascota</span>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Columna lateral derecha: Propietario responsable */}
        <aside className="reg-masc-side-col" aria-label="Propietario responsable">
          <section className="reg-masc-card">
            <h2>Propietario responsable</h2>
            <p className="reg-masc-side-sub">Asociación obligatoria</p>

            <div className="reg-masc-field reg-masc-owner-select">
              <label htmlFor="reg-masc-propietario">Buscar propietario *</label>
              <select
                id="reg-masc-propietario"
                value={propietarioId}
                onChange={(e) => setPropietarioId(e.target.value)}
              >
                {propietariosDisponibles.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="reg-masc-owner-card">
              <div className="reg-masc-owner-top">
                <span aria-hidden="true">👤</span>
              </div>

              <div className="reg-masc-owner-block">
                <span className="reg-masc-owner-label">Nombre completo</span>
                <strong className="reg-masc-owner-value">
                  {propietarioSeleccionado.nombre}
                </strong>
              </div>

              <div className="reg-masc-owner-block">
                <span className="reg-masc-owner-label">Documento</span>
                <strong className="reg-masc-owner-value">
                  {propietarioSeleccionado.documento}
                </strong>
              </div>

              <div className="reg-masc-owner-block">
                <span className="reg-masc-owner-label">Teléfono</span>
                <strong className="reg-masc-owner-value">
                  {propietarioSeleccionado.telefono}
                </strong>
              </div>

              <span className="reg-masc-owner-badge">
                {propietarioSeleccionado.estado}
              </span>
            </div>

            <button
              type="button"
              className="reg-masc-btn-new-owner"
              onClick={() => navigate("/recepcionista/propietarios/nuevo")}
            >
              <span>👤+</span>
              <span>Registrar nuevo propietario</span>
            </button>
          </section>

          <div className="reg-masc-warning-banner" role="note">
            <span className="reg-masc-warning-icon" aria-hidden="true">
              i
            </span>
            <div>
              <strong>Información importante</strong>
              <p>
                Las alergias se destacarán en la ficha y durante cada atención
                veterinaria.
              </p>
            </div>
          </div>

          <p className="reg-masc-side-footnote">
            Al guardar se asignará un código único al paciente y se creará su
            historial médico.
          </p>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}