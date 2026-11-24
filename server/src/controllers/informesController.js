
import pool from "../db.js";

const idValido = valor =>
  Number.isSafeInteger(Number(valor)) &&
  Number(valor) > 0 &&
  /^\d+$/.test(String(valor));

// 1. CONSULTAR INFORMES
export async function obtenerInformes(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT
         i.id_informe,
         i.id_atencion,
         i.id_generador,
         u.nombre AS generador,
         a.id_mascota,
         m.nombre AS mascota,
         p.nombre AS propietario,
         i.contenido,
         i.fecha_generacion
       FROM informes i
       JOIN atenciones a
         ON i.id_atencion = a.id_atencion
       JOIN mascotas m
         ON a.id_mascota = m.id_mascota
       JOIN propietarios p
         ON m.id_propietario = p.id_propietario
       JOIN usuarios u
         ON i.id_generador = u.id_usuario
       ORDER BY i.fecha_generacion DESC, i.id_informe DESC`
    );

    return res.json({
      success: true,
      total: resultado.rowCount,
      informes: resultado.rows
    });

  } catch (error) {
    console.error("Error al consultar informes:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al consultar informes"
    });
  }
}

// 2. CONSULTAR INFORME POR ID
export async function obtenerInformePorId(req, res) {
  const { id } = req.params;

  if (!idValido(id)) {
    return res.status(400).json({
      success: false,
      mensaje: "ID de informe inválido"
    });
  }

  try {
    const resultado = await pool.query(
      `SELECT
         i.*,
         u.nombre AS generador,
         a.id_mascota,
         a.motivo_consulta,
         a.fecha_atencion,
         m.nombre AS mascota,
         p.nombre AS propietario
       FROM informes i
       JOIN atenciones a
         ON i.id_atencion = a.id_atencion
       JOIN mascotas m
         ON a.id_mascota = m.id_mascota
       JOIN propietarios p
         ON m.id_propietario = p.id_propietario
       JOIN usuarios u
         ON i.id_generador = u.id_usuario
       WHERE i.id_informe = $1`,
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Informe no encontrado"
      });
    }

    return res.json({
      success: true,
      informe: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al consultar informe:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al consultar el informe"
    });
  }
}

// 3. GENERAR INFORME
export async function crearInforme(req, res) {
  const { id_atencion, contenido } = req.body || {};

  if (
    !Number.isSafeInteger(id_atencion) ||
    id_atencion <= 0 ||
    typeof contenido !== "string" ||
    !contenido.trim()
  ) {
    return res.status(400).json({
      success: false,
      mensaje: "Atención y contenido son obligatorios"
    });
  }

  if (contenido.length > 50000) {
    return res.status(400).json({
      success: false,
      mensaje: "El contenido del informe es demasiado extenso"
    });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO informes (
         id_atencion,
         id_generador,
         contenido
       )
       SELECT
         a.id_atencion,
         $2,
         $3
       FROM atenciones a
       WHERE a.id_atencion = $1
         AND a.id_veterinario = $2
       RETURNING *`,
      [
        id_atencion,
        req.usuario.id_usuario,
        contenido.trim()
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Atención no encontrada o no asignada al veterinario"
      });
    }

    return res.status(201).json({
      success: true,
      mensaje: "Informe generado correctamente",
      informe: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al generar informe:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al generar el informe"
    });
  }
}
