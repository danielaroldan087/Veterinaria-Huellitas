import pool from '../db.js';
/** Encapsula la consulta de credenciales; nunca devuelve datos al cliente HTTP. */
export async function findByEmail(correo) {
  const { rows } = await pool.query(`SELECT u.id_usuario, u.nombre, u.correo,
    u.password_hash, u.activo, r.nombre AS rol FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol WHERE LOWER(u.correo) = LOWER($1)`, [correo]);
  return rows[0];
}
