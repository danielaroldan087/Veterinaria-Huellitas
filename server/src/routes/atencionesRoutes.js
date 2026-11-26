
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
  permitirRoles, exigirPermiso
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verificarToken);

router.use(
  permitirRoles("administrador", "veterinario")
);

router.get("/", exigirPermiso("atenciones.ver"), obtenerAtenciones);

router.get(
  "/mascota/:id",
  exigirPermiso("atenciones.ver"), obtenerHistorialMascota
);

router.post(
  "/",
  permitirRoles("veterinario"),
  exigirPermiso("atenciones.crear"), crearAtencion
);

router.post(
  "/:id/diagnosticos",
  permitirRoles("veterinario"),
  exigirPermiso("atenciones.crear"), crearDiagnostico
);

router.post(
  "/:id/tratamientos",
  permitirRoles("veterinario"),
  exigirPermiso("atenciones.crear"), crearTratamiento
);


export default router;
