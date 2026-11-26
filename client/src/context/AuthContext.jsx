
import {
  createContext,
  useContext,
  useState
} from "react";

import {
  iniciarSesion,
  obtenerPerfil
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
  const [usuario, setUsuario] = useState({
    nombre: "Sofía Ramírez",
    correo: "sofia.ramirez@huellitas.pe",
    rol: "recepcionista",
    sede: "Miraflores"
  });
  const [token, setToken] = useState("token-prueba-recepcionista");

  async function login(correo, password) {
    const sesion = await iniciarSesion(correo, password);

    // Comprobamos que el token también funcione
    // en una ruta protegida del backend.
    const perfil = await obtenerPerfil(sesion.token);

    if (!perfil.success || !perfil.usuario) {
      throw new Error("No se pudo validar la sesión");
    }

    setToken(sesion.token);
    setUsuario({
      ...sesion.usuario,
      ...perfil.usuario
    });

    return {
      ...sesion.usuario,
      ...perfil.usuario
    };
  }

  function logout() {
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado: Boolean(usuario && token),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth requiere AuthProvider");
  }

  return contexto;
}
