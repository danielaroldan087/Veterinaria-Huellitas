import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutRecepcion from "../components/LayoutRecepcion";
import "./RegistrarPropietarioRecepcion.css";

const distritosClinica = [
  "Miraflores",
  "San Isidro",
  "Barranco",
  "Surco",
  "San Borja",
  "Lince"
];

export default function RegistrarPropietarioRecepcion() {
  const navigate = useNavigate();

  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("45872136");
  const [nombres, setNombres] = useState("María");
  const [apellidos, setApellidos] = useState("García López");
  const [telefono, setTelefono] = useState("+51 987 654 321");
  const [correo, setCorreo] = useState("maria.garcia@gmail.com");
  const [direccion, setDireccion] = useState("Av. José Pardo 485, dpto. 302");
  const [distrito, setDistrito] = useState("Miraflores");
  const [ciudad, setCiudad] = useState("Lima");
  const [autorizaDatos, setAutorizaDatos] = useState(true);

  const [errorForm, setErrorForm] = useState("");
  const [exitoForm, setExitoForm] = useState("");

  function manejarVolverPropietarios() {
    navigate("/recepcionista/propietarios");
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
    setExitoForm(`Sección "${id}" en preparación.`);
    setErrorForm("");
  }

  function manejarGuardarPropietario(evento) {
    evento.preventDefault();
    setErrorForm("");
    setExitoForm("");

    if (
      !tipoDocumento.trim() ||
      !numeroDocumento.trim() ||
      !nombres.trim() ||
      !apellidos.trim() ||
      !telefono.trim() ||
      !direccion.trim()
    ) {
      setErrorForm("Completa todos los campos obligatorios (*).");
      return;
    }

    if (tipoDocumento === "DNI" && !/^\d{8}$/.test(numeroDocumento.trim())) {
      setErrorForm("El DNI debe contener exactamente 8 dígitos numéricos.");
      return;
    }

    if (correo.trim() && !correo.includes("@")) {
      setErrorForm("Ingresa un correo electrónico válido.");
      return;
    }

    if (!autorizaDatos) {
      setErrorForm(
        "Debe marcar la autorización para el uso de datos en la atención veterinaria."
      );
      return;
    }

    setExitoForm(
      `Propietario ${nombres.trim()} ${apellidos.trim()} (${tipoDocumento} ${numeroDocumento.trim()}) registrado correctamente.`
    );
  }

  return (
    <LayoutRecepcion
      breadcrumb="Huellitas de Amor / Propietarios / Registrar propietario"
      seccionActivaInicial="propietarios"
      onSeleccionarSeccion={manejarSeleccionSeccion}
    >
      {/* Encabezado principal */}
      <div className="reg-prop-header-row">
        <div>
          <h1 className="reg-prop-title">Registrar propietario</h1>
          <p className="reg-prop-subtitle">
            Crea la ficha de la persona responsable del cuidado de la mascota.
          </p>
        </div>

        <button
          type="button"
          className="reg-prop-btn-back"
          onClick={manejarVolverPropietarios}
        >
          <span>←</span>
          <span>Volver a propietarios</span>
        </button>
      </div>

      {/* Grid de 2 columnas */}
      <div className="reg-prop-grid">
        {/* Columna principal: Formulario */}
        <section className="reg-prop-card" aria-label="Datos del propietario">
          <div className="reg-prop-card-header">
            <h2>Datos del propietario</h2>
            <p>Completa la información de contacto y verifica el documento.</p>
          </div>

          <form
            className="reg-prop-form"
            onSubmit={manejarGuardarPropietario}
            noValidate
          >
            <div className="reg-prop-two-cols">
              <div className="reg-prop-field">
                <label htmlFor="reg-tipo-doc">Tipo de documento *</label>
                <select
                  id="reg-tipo-doc"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>

              <div className="reg-prop-field">
                <label htmlFor="reg-num-doc">Número de documento *</label>
                <input
                  id="reg-num-doc"
                  type="text"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                />
                <span className="reg-prop-helper">
                  8 dígitos · documento válido
                </span>
              </div>
            </div>

            <div className="reg-prop-two-cols">
              <div className="reg-prop-field">
                <label htmlFor="reg-nombres">Nombres *</label>
                <input
                  id="reg-nombres"
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                />
              </div>

              <div className="reg-prop-field">
                <label htmlFor="reg-apellidos">Apellidos *</label>
                <input
                  id="reg-apellidos"
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                />
              </div>
            </div>

            <div className="reg-prop-two-cols">
              <div className="reg-prop-field">
                <label htmlFor="reg-telefono">Teléfono celular *</label>
                <input
                  id="reg-telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div className="reg-prop-field">
                <label htmlFor="reg-correo">Correo electrónico</label>
                <input
                  id="reg-correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </div>

            <div className="reg-prop-field">
              <label htmlFor="reg-direccion">Dirección *</label>
              <input
                id="reg-direccion"
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>

            <div className="reg-prop-two-cols">
              <div className="reg-prop-field">
                <label htmlFor="reg-distrito">Distrito</label>
                <select
                  id="reg-distrito"
                  value={distrito}
                  onChange={(e) => setDistrito(e.target.value)}
                >
                  {distritosClinica.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reg-prop-field">
                <label htmlFor="reg-ciudad">Ciudad</label>
                <input
                  id="reg-ciudad"
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                />
              </div>
            </div>

            <label className="reg-prop-checkbox" htmlFor="reg-autorizacion">
              <input
                id="reg-autorizacion"
                type="checkbox"
                checked={autorizaDatos}
                onChange={(e) => setAutorizaDatos(e.target.checked)}
              />
              <span>
                La propietaria autoriza el uso de sus datos para la atención
                veterinaria.
              </span>
            </label>

            {errorForm && (
              <p role="alert" className="reg-prop-error">
                {errorForm}
              </p>
            )}
            {exitoForm && (
              <p role="status" className="reg-prop-success">
                {exitoForm}
              </p>
            )}

            <div className="reg-prop-form-footer">
              <span className="reg-prop-required-note">
                Los campos con * son obligatorios.
              </span>

              <div className="reg-prop-actions">
                <button
                  type="button"
                  className="reg-prop-btn-cancel"
                  onClick={manejarVolverPropietarios}
                >
                  Cancelar
                </button>
                <button type="submit" className="reg-prop-btn-submit">
                  <span>✓</span>
                  <span>Guardar propietario</span>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Columna lateral derecha */}
        <aside className="reg-prop-side-col">
          <section className="reg-prop-card" aria-label="Una familia, una ficha">
            <h2>Una familia, una ficha</h2>

            <div className="reg-prop-family-icon" aria-hidden="true">
              👥
            </div>

            <p className="reg-prop-side-text">
              Registra al propietario una sola vez. Podrás asociarle todas sus
              mascotas desde su ficha.
            </p>

            <div className="reg-prop-next-step">
              <span className="reg-prop-next-label">Siguiente paso</span>
              <strong className="reg-prop-next-pet">Registrar a Luna</strong>
            </div>

            <p className="reg-prop-side-footnote">
              Al guardar, el propietario quedará activo y podrás agendar su
              primera visita.
            </p>
          </section>

          <div className="reg-prop-info-banner" role="note">
            <span className="reg-prop-info-icon" aria-hidden="true">
              i
            </span>
            <div>
              <strong>Evita registros duplicados</strong>
              <p>
                Antes de guardar, comprobamos el número de documento y el correo
                electrónico.
              </p>
            </div>
          </div>

          <section className="reg-prop-card" aria-label="Protección de datos">
            <h2>Protección de datos</h2>
            <p className="reg-prop-side-text reg-prop-compact">
              La información personal solo será visible para el equipo autorizado
              de Huellitas de Amor.
            </p>
          </section>
        </aside>
      </div>
    </LayoutRecepcion>
  );
}