import { passwordValida } from "../domain/passwordPolicy.js";
import pool from "../db.js";
import bcrypt from "bcrypt";

import { Router } from "express";
import { iniciarSesion } from "../controllers/authController.js";
import {
  verificarToken
} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", iniciarSesion);

router.get("/perfil", verificarToken, (req, res) => {
  res.json({
    success: true,
    usuario: req.usuario
  });
});

router.put("/perfil", verificarToken, async (req, res) => {
  const { nombre, correo } = req.body || {};
  if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 120 || typeof correo !== "string" || correo.trim().length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return res.status(400).json({ mensaje: "Nombre o correo inválido" });
  try {
    const { rows } = await pool.query("UPDATE usuarios SET nombre=$1, correo=$2 WHERE id_usuario=$3 RETURNING id_usuario,nombre,correo", [nombre.trim(), correo.trim().toLowerCase(), req.usuario.id_usuario]);
    res.json({ success: true, usuario: rows[0] });
  } catch (error) { res.status(error.code === "23505" ? 409 : 500).json({ mensaje: error.code === "23505" ? "El correo ya está registrado" : "No se pudo actualizar el perfil" }); }
});
router.put("/password", verificarToken, async (req, res) => {
  const { actual, nueva } = req.body || {};
  if (typeof actual !== "string" || !passwordValida(nueva) || actual === nueva) return res.status(400).json({ mensaje: "La nueva contraseña debe ser distinta, tener al menos 10 caracteres, mayúsculas, minúsculas y números, y un máximo de 72 bytes" });
  try {
    const { rows } = await pool.query("SELECT password_hash FROM usuarios WHERE id_usuario=$1", [req.usuario.id_usuario]);
    if (!rows[0] || !await bcrypt.compare(actual, rows[0].password_hash)) return res.status(400).json({ mensaje: "La contraseña actual es incorrecta" });
    const hash = await bcrypt.hash(nueva, 12);
    const resultado = await pool.query("UPDATE usuarios SET password_hash=$1 WHERE id_usuario=$2 AND password_hash=$3", [hash, req.usuario.id_usuario, rows[0].password_hash]);
    if (!resultado.rowCount) return res.status(409).json({ mensaje: "La contraseña cambió. Intenta nuevamente" });
    res.json({ success: true, mensaje: "Contraseña actualizada" });
  } catch (error) { res.status(500).json({ mensaje: "No se pudo actualizar la contraseña" }); }
});
export default router;
