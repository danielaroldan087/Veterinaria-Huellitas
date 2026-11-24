
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [estado, setEstado] = useState("Conectando...");
  const [mascotas, setMascotas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaEstado = await fetch(`${API_URL}/health`);

        if (!respuestaEstado.ok) {
          throw new Error("No se pudo consultar el servidor");
        }

        const datosEstado = await respuestaEstado.json();
        setEstado(datosEstado.message);

        const respuestaMascotas = await fetch(`${API_URL}/mascotas`);

        if (!respuestaMascotas.ok) {
          throw new Error("No se pudieron consultar las mascotas");
        }

        const datosMascotas = await respuestaMascotas.json();
        setMascotas(datosMascotas.mascotas);
      } catch (err) {
        setError(err.message);
        setEstado("Sin conexión");
      }
    }

    cargarDatos();
  }, []);

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>🐾 Veterinaria Huellitas de Amor</h1>

      <h2>Estado del sistema</h2>
      <p>{estado}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Mascotas registradas (prueba)</h2>

      <ul>
        {mascotas.map((mascota) => (
          <li key={mascota.id}>
            {mascota.nombre} — {mascota.especie}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;

