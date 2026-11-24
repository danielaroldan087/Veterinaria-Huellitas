
import pool from "../db.js";

// Obtener todas las mascotas
export async function obtenerMascotas(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT
        m.id_mascota,
        m.id_propietario,
        m.nombre,
        m.especie,
        m.raza,
        m.sexo,
        m.fecha_nacimiento,
        m.color,
        m.peso_kg,
        m.esterilizado,
        m.alergias,
        m.observaciones,
        m.activo,
        p.nombre AS propietario,
        p.telefono AS telefono_propietario
      FROM mascotas m
      INNER JOIN propietarios p
        ON m.id_propietario = p.id_propietario
      ORDER BY m.id_mascota
    `);

    res.json({
      success: true,
      mascotas: resultado.rows
    });
  } catch (error) {
    console.error("Error al consultar mascotas:", error.message);

    res.status(500).json({
      success: false,
      mensaje: "Error al consultar mascotas"
    });
  }
}

// Obtener una mascota por ID
export async function obtenerMascotaPorId(req, res) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de mascota inválido"
      });
    }

    const resultado = await pool.query(
      `SELECT
         m.*,
         p.nombre AS propietario,
         p.telefono AS telefono_propietario
       FROM mascotas m
       INNER JOIN propietarios p
         ON m.id_propietario = p.id_propietario
       WHERE m.id_mascota = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Mascota no encontrada"
      });
    }

    res.json({
      success: true,
      mascota: resultado.rows[0]
    });
  } catch (error) {
    console.error("Error al consultar mascota:", error.message);

    res.status(500).json({
      success: false,
      mensaje: "Error al consultar mascota"
    });
  }
}

export async function crearMascota(req, res) {
  try {
    const {
      id_propietario,
      nombre,
      especie,
      raza,
      sexo,
      fecha_nacimiento,
      color,
      peso_kg,
      esterilizado,
      alergias,
      observaciones
    } = req.body;

    // Validar datos obligatorios
    if (
      !Number.isSafeInteger(id_propietario) ||
      id_propietario <= 0 ||
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof especie !== "string" ||
      !especie.trim()
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Propietario, nombre y especie son obligatorios"
      });
    }

    // Validar campos de texto opcionales
    const textos = [
      raza, sexo, fecha_nacimiento,
      color, alergias, observaciones
    ];

    if (textos.some(
      valor => valor != null && typeof valor !== "string"
    )) {
      return res.status(400).json({
        success: false,
        mensaje: "Los campos de texto contienen valores inválidos"
      });
    }

    // Validar longitudes
    if (
      nombre.trim().length > 100 ||
      especie.trim().length > 60 ||
      (raza?.length || 0) > 100 ||
      (sexo?.length || 0) > 15 ||
      (color?.length || 0) > 60
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Uno o más campos exceden su longitud permitida"
      });
    }

    // Validar peso
    if (
      peso_kg != null &&
      (typeof peso_kg !== "number" ||
       !Number.isFinite(peso_kg) ||
       peso_kg <= 0)
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "El peso debe ser un número positivo"
      });
    }

    // Validar esterilización
    if (
      esterilizado != null &&
      typeof esterilizado !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Esterilizado debe ser true o false"
      });
    }

    // Validar fecha de nacimiento
    if (fecha_nacimiento) {
      const fecha = new Date(fecha_nacimiento);

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento) ||
        Number.isNaN(fecha.getTime()) ||
        fecha.toISOString().slice(0, 10) !== fecha_nacimiento ||
        fecha.getTime() > Date.now()
      ) {
        return res.status(400).json({
          success: false,
          mensaje: "Fecha de nacimiento inválida"
        });
      }
    }

    // Verificar propietario activo
    const propietario = await pool.query(
      `SELECT id_propietario
       FROM propietarios
       WHERE id_propietario = $1
         AND activo = true`,
      [id_propietario]
    );

    if (propietario.rowCount === 0) {
      return res.status(400).json({
        success: false,
        mensaje: "El propietario no existe o está inactivo"
      });
    }

    // Registrar mascota
    const resultado = await pool.query(
      `INSERT INTO mascotas (
         id_propietario,
         nombre,
         especie,
         raza,
         sexo,
         fecha_nacimiento,
         color,
         peso_kg,
         esterilizado,
         alergias,
         observaciones
       )
       VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11
       )
       RETURNING *`,
      [
        id_propietario,
        nombre.trim(),
        especie.trim(),
        raza?.trim() || null,
        sexo?.trim() || null,
        fecha_nacimiento || null,
        color?.trim() || null,
        peso_kg ?? null,
        esterilizado ?? null,
        alergias?.trim() || null,
        observaciones?.trim() || null
      ]
    );

    return res.status(201).json({
      success: true,
      mensaje: "Mascota registrada correctamente",
      mascota: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        mensaje: "El propietario indicado no es válido"
      });
    }

    if (error.code === "23514") {
      return res.status(400).json({
        success: false,
        mensaje: "Los datos no cumplen las restricciones de la base de datos"
      });
    }

    console.error("Error al registrar mascota:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al registrar mascota"
    });
  }
}

export async function actualizarMascota(req, res) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de mascota inválido"
      });
    }

    const {
      id_propietario,
      nombre,
      especie,
      raza,
      sexo,
      fecha_nacimiento,
      color,
      peso_kg,
      esterilizado,
      alergias,
      observaciones
    } = req.body;

    if (
      !Number.isSafeInteger(id_propietario) ||
      id_propietario <= 0 ||
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof especie !== "string" ||
      !especie.trim()
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Propietario, nombre y especie son obligatorios"
      });
    }

    const textos = [
      raza, sexo, fecha_nacimiento,
      color, alergias, observaciones
    ];

    if (textos.some(
      valor => valor != null && typeof valor !== "string"
    )) {
      return res.status(400).json({
        success: false,
        mensaje: "Los campos de texto contienen valores inválidos"
      });
    }

    if (
      nombre.trim().length > 100 ||
      especie.trim().length > 60 ||
      (raza?.length || 0) > 100 ||
      (sexo?.length || 0) > 15 ||
      (color?.length || 0) > 60
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Uno o más campos exceden la longitud permitida"
      });
    }

    if (
      peso_kg != null &&
      (typeof peso_kg !== "number" ||
       !Number.isFinite(peso_kg) ||
       peso_kg <= 0)
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "El peso debe ser un número positivo"
      });
    }

    if (
      esterilizado != null &&
      typeof esterilizado !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Esterilizado debe ser true o false"
      });
    }

    if (fecha_nacimiento) {
      const fecha = new Date(fecha_nacimiento);

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento) ||
        Number.isNaN(fecha.getTime()) ||
        fecha.toISOString().slice(0, 10) !== fecha_nacimiento ||
        fecha.getTime() > Date.now()
      ) {
        return res.status(400).json({
          success: false,
          mensaje: "Fecha de nacimiento inválida"
        });
      }
    }

    const propietario = await pool.query(
      `SELECT id_propietario
       FROM propietarios
       WHERE id_propietario = $1
         AND activo = true`,
      [id_propietario]
    );

    if (propietario.rowCount === 0) {
      return res.status(400).json({
        success: false,
        mensaje: "El propietario no existe o está inactivo"
      });
    }

    const resultado = await pool.query(
      `UPDATE mascotas
       SET id_propietario = $1,
           nombre = $2,
           especie = $3,
           raza = $4,
           sexo = $5,
           fecha_nacimiento = $6,
           color = $7,
           peso_kg = $8,
           esterilizado = $9,
           alergias = $10,
           observaciones = $11
       WHERE id_mascota = $12
       RETURNING *`,
      [
        id_propietario,
        nombre.trim(),
        especie.trim(),
        raza?.trim() || null,
        sexo?.trim() || null,
        fecha_nacimiento || null,
        color?.trim() || null,
        peso_kg ?? null,
        esterilizado ?? null,
        alergias?.trim() || null,
        observaciones?.trim() || null,
        id
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Mascota no encontrada"
      });
    }

    return res.json({
      success: true,
      mensaje: "Mascota actualizada correctamente",
      mascota: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23514") {
      return res.status(400).json({
        success: false,
        mensaje: "Los datos no cumplen las restricciones de la base de datos"
      });
    }

    console.error("Error al actualizar mascota:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al actualizar mascota"
    });
  }
}

export async function cambiarEstadoMascota(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de mascota inválido"
      });
    }

    if (typeof activo !== "boolean") {
      return res.status(400).json({
        success: false,
        mensaje: "El campo activo debe ser true o false"
      });
    }

    const resultado = await pool.query(
      `UPDATE mascotas
       SET activo = $1
       WHERE id_mascota = $2
       RETURNING id_mascota, nombre, activo`,
      [activo, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Mascota no encontrada"
      });
    }

    return res.json({
      success: true,
      mensaje: activo
        ? "Mascota activada correctamente"
        : "Mascota desactivada correctamente",
      mascota: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al cambiar estado de mascota:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al cambiar el estado"
    });
  }
}
