
import { Router } from "express";

import {
  obtenerPropietarios,
  obtenerPropietarioPorId,
  crearPropietario,
  actualizarPropietario,
  cambiarEstadoPropietario
} from "../controllers/propietariosController.js";

import {
  verificarToken,
  permitirRoles
} from "../middlewares/authMiddleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Solo administrador y recepcionista
router.use(
  permitirRoles("administrador", "recepcionista")
);

router.get("/", obtenerPropietarios);
router.get("/:id", obtenerPropietarioPorId);
router.post("/", crearPropietario);
router.put("/:id", actualizarPropietario);
router.patch("/:id/estado", cambiarEstadoPropietario);

export default router;

