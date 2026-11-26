
import { Router } from "express";

import {
  obtenerMascotas,
  obtenerMascotaPorId,
  crearMascota,
  actualizarMascota,
  cambiarEstadoMascota
} from "../controllers/mascotasController.js";

import {
  verificarToken,
  permitirRoles, exigirPermiso
} from "../middlewares/authMiddleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Los tres roles pueden consultar mascotas
router.use(
  permitirRoles(
    "administrador",
    "recepcionista",
    "veterinario"
  )
);

router.get("/", exigirPermiso("mascotas.ver"), obtenerMascotas);
router.get("/:id", exigirPermiso("mascotas.ver"), obtenerMascotaPorId);
router.post(
  "/",
  permitirRoles("administrador", "recepcionista"),
  exigirPermiso("mascotas.crear"), crearMascota
);
router.put(
  "/:id",
  permitirRoles("administrador", "recepcionista"),
  exigirPermiso("mascotas.editar"), actualizarMascota
);

router.patch(
  "/:id/estado",
  permitirRoles("administrador", "recepcionista"),
  exigirPermiso("mascotas.editar"), cambiarEstadoMascota
);

export default router;
