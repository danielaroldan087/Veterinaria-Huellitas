
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
  permitirRoles, exigirPermiso
} from "../middlewares/authMiddleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Solo administrador y recepcionista
router.use(
  permitirRoles("administrador", "recepcionista", "veterinario")
);

router.get("/", exigirPermiso("propietarios.ver"), obtenerPropietarios);
router.get("/:id", exigirPermiso("propietarios.ver"), obtenerPropietarioPorId);
router.post("/", permitirRoles("administrador", "recepcionista"), exigirPermiso("propietarios.crear"), crearPropietario);
router.put("/:id", permitirRoles("administrador", "recepcionista"), exigirPermiso("propietarios.editar"), actualizarPropietario);
router.patch("/:id/estado", permitirRoles("administrador", "recepcionista"), exigirPermiso("propietarios.editar"), cambiarEstadoPropietario);

export default router;

