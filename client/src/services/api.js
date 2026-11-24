
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("Falta configurar VITE_API_URL");
}

export async function apiRequest(
  endpoint,
  { token, headers = {}, ...options } = {}
) {
  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body != null
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {})
    }
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje || "Error al comunicarse con el servidor"
    );
  }

  return datos;
}
