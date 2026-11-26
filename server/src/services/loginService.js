import { AppError } from '../errors/AppError.js';
/** Inyecta dependencias para probar el flujo sin PostgreSQL, bcrypt ni JWT reales. */
export function createLoginService({ findByEmail, comparePassword, issueToken }) {
  return async function login({ correo, password } = {}) {
    if (typeof correo !== 'string' || typeof password !== 'string' || !correo.trim() || !password)
      throw new AppError(400, 'Correo y contraseña son obligatorios');
    const usuario = await findByEmail(correo.trim());
    if (!usuario?.activo || !await comparePassword(password, usuario.password_hash))
      throw new AppError(401, 'Credenciales incorrectas');
    const token = issueToken(usuario);
    const { id_usuario, nombre, correo: email, rol } = usuario;
    return { success: true, mensaje: 'Inicio de sesión exitoso', token,
      usuario: { id_usuario, nombre, correo: email, rol } };
  };
}
