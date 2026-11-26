import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { verificarToken } from "./middlewares/authMiddleware.js";
import recoveryRoutes from "./routes/recoveryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import mascotasRoutes from "./routes/mascotasRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import propietariosRoutes from "./routes/propietariosRoutes.js";
import citasRoutes from "./routes/citasRoutes.js";
import atencionesRoutes from "./routes/atencionesRoutes.js";
import informesRoutes from "./routes/informesRoutes.js";
import pool from "./db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/propietarios", propietariosRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/recuperacion", recoveryRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/atenciones", atencionesRoutes);
app.use("/api/informes", informesRoutes);
app.use("/api/admin", adminRoutes);


// Ruta principal
app.get("/", (req, res) => {
  res.json({
    nombre: "Veterinaria Huellitas de Amor",
    estado: "Servidor activo"
  });
});

// Comprobar conexión con React
app.get("/api/health", (req, res) => {
  res.json({
    message: "Conexión exitosa con el backend de Huellitas de Amor"
  });
});


// Comprobar conexión con PostgreSQL
app.get("/api/database/health", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT current_database() AS base_datos, NOW() AS fecha"
    );

    res.json({
      success: true,
      mensaje: "Conexión exitosa con PostgreSQL",
      datos: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error de PostgreSQL:", error.message);

    res.status(500).json({
      success: false,
      mensaje: "No se pudo conectar con PostgreSQL",
    });
  }
});

// Consultar roles desde la base de datos
app.get("/api/roles", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id_rol, nombre, descripcion FROM roles ORDER BY id_rol"
    );

    res.json({
      success: true,
      roles: resultado.rows,
    });
  } catch (error) {
    console.error("Error al consultar roles:", error.message);

    res.status(500).json({
      success: false,
      mensaje: "Error al consultar los roles",
    });
  }
});

app.get('/api/configuracion',verificarToken,async(req,res)=>{try{const {rows}=await pool.query("SELECT clave,valor FROM configuracion_sistema WHERE clave IN ('nombre_veterinaria','duracion_cita_minutos','moneda')");res.json(Object.fromEntries(rows.map(r=>[r.clave,r.valor])));}catch(e){res.status(500).json({mensaje:'No se pudo consultar la configuración'});}});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
