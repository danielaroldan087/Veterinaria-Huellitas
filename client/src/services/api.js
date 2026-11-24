
const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error("Falta configurar VITE_API_URL");
  }

  const { token, headers = {}, ...fetchOptions } = options;

  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...(fetchOptions.body != null
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {})
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(
      datos.mensaje || "Ocurrió un error en la solicitud"
    );

    error.status = respuesta.status;
    throw error;
  }

  return datos;
}
