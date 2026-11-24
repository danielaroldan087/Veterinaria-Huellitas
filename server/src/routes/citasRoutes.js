
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
  permitirRoles
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

router.get("/", obtenerCitas);
router.get("/:id", obtenerCitaPorId);
router.post(
  "/",
  permitirRoles("administrador", "recepcionista"),
  crearCita
);

router.put(
  "/:id/reprogramar",
  permitirRoles("administrador", "recepcionista"),
  reprogramarCita
);

router.patch(
  "/:id/confirmar",
  permitirRoles("administrador", "recepcionista"),
  confirmarCita
);

router.patch(
  "/:id/cancelar",
  permitirRoles("administrador", "recepcionista"),
  cancelarCita
);

router.patch(
  "/:id/completar",
  permitirRoles("administrador", "veterinario"),
  completarCita
);


export default router;
