
import { Router } from "express";
import { iniciarSesion } from "../controllers/authController.js";
import {
  verificarToken
} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", iniciarSesion);

router.get("/perfil", verificarToken, (req, res) => {
  res.json({
    success: true,
    usuario: req.usuario
  });
});

export default router;
