
import { Router } from "express";

import {
  obtenerInformes,
  obtenerInformePorId,
  crearInforme
} from "../controllers/informesController.js";

import {
  verificarToken,
  permitirRoles, exigirPermiso
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verificarToken);

// Consultas para administrador y veterinario
router.get(
  "/",
  permitirRoles("administrador", "veterinario"),
  exigirPermiso("informes.generar"), obtenerInformes
);

router.get(
  "/:id",
  permitirRoles("administrador", "veterinario"),
  exigirPermiso("informes.generar"), obtenerInformePorId
);

// Solo veterinarios generan informes
router.post(
  "/",
  permitirRoles("veterinario"),
  exigirPermiso("informes.generar"), crearInforme
);

export default router;
