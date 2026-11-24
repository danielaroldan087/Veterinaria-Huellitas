
import { Router } from "express";

import {
  obtenerInformes,
  obtenerInformePorId,
  crearInforme
} from "../controllers/informesController.js";

import {
  verificarToken,
  permitirRoles
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verificarToken);

// Consultas para administrador y veterinario
router.get(
  "/",
  permitirRoles("administrador", "veterinario"),
  obtenerInformes
);

router.get(
  "/:id",
  permitirRoles("administrador", "veterinario"),
  obtenerInformePorId
);

// Solo veterinarios generan informes
router.post(
  "/",
  permitirRoles("veterinario"),
  crearInforme
);

export default router;
