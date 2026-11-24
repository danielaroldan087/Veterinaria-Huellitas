
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
  permitirRoles
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

router.get("/", obtenerMascotas);
router.get("/:id", obtenerMascotaPorId);
router.post(
  "/",
  permitirRoles("administrador", "recepcionista"),
  crearMascota
);
router.put(
  "/:id",
  permitirRoles("administrador", "recepcionista"),
  actualizarMascota
);

router.patch(
  "/:id/estado",
  permitirRoles("administrador", "recepcionista"),
  cambiarEstadoMascota
);

export default router;
