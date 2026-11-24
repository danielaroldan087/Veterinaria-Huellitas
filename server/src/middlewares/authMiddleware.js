
import jwt from "jsonwebtoken";
import pool from "../db.js";

export async function verificarToken(req, res, next) {
  const autorizacion = req.headers.authorization;

  if (!autorizacion?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      mensaje: "Token de acceso requerido"
    });
  }

  try {
    const token = autorizacion.slice(7);

    const datos = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    const resultado = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.activo,
              r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.id_usuario = $1`,
      [datos.sub]
    );

    const usuario = resultado.rows[0];

    if (!usuario?.activo) {
      return res.status(401).json({
        success: false,
        mensaje: "Cuenta no autorizada"
      });
    }

    req.usuario = usuario;
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        mensaje: "Token inválido o expirado"
      });
    }

    console.error("Error de autenticación:", error.message);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno de autenticación"
    });
  }
}

export function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        mensaje: "No tienes permisos para esta operación"
      });
    }

    next();
  };
}
