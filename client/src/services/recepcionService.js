import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "./api";
export function useRecepcion() {
  const { token, logout } = useAuth();
  return useCallback(async (path, method = "GET", data) => {
    try { return await apiRequest(path, { token, method, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }); }
    catch (error) { if (error.status === 401) logout(); throw error; }
  }, [token, logout]);
}
export function useDatos(paths) {
  const { token, logout } = useAuth();
  const [datos, setDatos] = useState({});
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [version, setVersion] = useState(0);
  const clave = paths.join("|");
  useEffect(() => {
    let vigente = true;
    setCargando(true); setError("");
    Promise.all(clave.split("|").map(async path => [path, await apiRequest(path, { token })]))
      .then(rows => { if (vigente) setDatos(Object.fromEntries(rows)); })
      .catch(e => { if (vigente) { setError(e.message); if (e.status === 401) logout(); } })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [clave, token, version, logout]);
  return { datos, error, cargando, recargar: () => setVersion(v => v + 1) };
}
