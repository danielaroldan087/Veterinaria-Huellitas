
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export async function iniciarSesion(req, res) {
  try {
    const { correo, password } = req.body;

    if (
      typeof correo !== "string" ||
      typeof password !== "string" ||
      !correo.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const resultado = await pool.query(
      `SELECT
         u.id_usuario,
         u.nombre,
         u.correo,
         u.password_hash,
         u.activo,
         r.nombre AS rol
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id_rol
       WHERE LOWER(u.correo) = LOWER($1)`,
      [correo.trim()]
    );

    const usuario = resultado.rows[0];

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        mensaje: "Credenciales incorrectas"
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        mensaje: "Credenciales incorrectas"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado");
    }

    const token = jwt.sign(
      { rol: usuario.rol },
      process.env.JWT_SECRET,
      {
        subject: String(usuario.id_usuario),
        expiresIn: process.env.JWT_EXPIRES_IN || "2h",
        algorithm: "HS256"
      }
    );

    res.json({
      success: true,
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error.message);

    res.status(500).json({
      success: false,
      mensaje: "Error interno al iniciar sesión"
    });
  }
}
