
import { Router } from "express";

import {
  obtenerAtenciones,
  obtenerHistorialMascota,
  crearAtencion,
  crearDiagnostico,
  crearTratamiento
} from "../controllers/atencionesController.js";

import {
  verificarToken,
  permitirRoles
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verificarToken);

router.use(
  permitirRoles("administrador", "veterinario")
);

router.get("/", obtenerAtenciones);

router.get(
  "/mascota/:id",
  obtenerHistorialMascota
);

router.post(
  "/",
  permitirRoles("veterinario"),
  crearAtencion
);

router.post(
  "/:id/diagnosticos",
  permitirRoles("veterinario"),
  crearDiagnostico
);

router.post(
  "/:id/tratamientos",
  permitirRoles("veterinario"),
  crearTratamiento
);


export default router;
