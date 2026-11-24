
import { apiRequest } from "./api";

export async function iniciarSesion(correo, password) {
  const datos = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      correo: correo.trim(),
      password
    })
  });

  if (!datos.success || !datos.token || !datos.usuario) {
    throw new Error("Respuesta de autenticación incompleta");
  }

  return {
    token: datos.token,
    usuario: datos.usuario
  };
}

export async function obtenerPerfil(token) {
  return apiRequest("/auth/perfil", {
    token
  });
}
