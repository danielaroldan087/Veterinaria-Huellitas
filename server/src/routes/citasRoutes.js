import pool from "../db.js";

import { Router } from "express";

import {
  obtenerCitas,
  obtenerCitaPorId,
  crearCita,
   reprogramarCita,
  confirmarCita,
  cancelarCita,
  completarCita
} from "../controllers/citasController.js";

import {
  verificarToken,
  permitirRoles, exigirPermiso
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verificarToken);

router.use(
  permitirRoles(
    "administrador",
    "recepcionista",
    "veterinario"
  )
);

router.get("/", exigirPermiso("citas.ver"), obtenerCitas);
router.get("/veterinarios", permitirRoles("administrador", "recepcionista"), exigirPermiso("citas.ver"), async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT u.id_usuario, u.nombre FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol WHERE u.activo = true AND r.nombre = 'veterinario' ORDER BY u.nombre");
    res.json({ success: true, veterinarios: rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, mensaje: "No se pudo consultar veterinarios" });
  }
});
router.get("/:id", exigirPermiso("citas.ver"), obtenerCitaPorId);
router.post(
  "/",
  permitirRoles("administrador", "recepcionista"),
  exigirPermiso("citas.gestionar"), crearCita
);

router.put(
  "/:id/reprogramar",
  permitirRoles("administrador", "recepcionista"),
  exigirPermiso("citas.gestionar"), reprogramarCita
);

router.patch(
  "/:id/confirmar",
  permitirRoles("administrador", "recepcionista"),
  exigirPermiso("citas.gestionar"), confirmarCita
);

router.patch(
  "/:id/cancelar",
  permitirRoles("administrador", "recepcionista"),
  exigirPermiso("citas.gestionar"), cancelarCita
);

router.patch(
  "/:id/completar",
  permitirRoles("administrador", "veterinario"),
  exigirPermiso("atenciones.crear"), completarCita
);


export default router;
