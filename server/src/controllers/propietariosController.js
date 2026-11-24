
import pool from "../db.js";

// Consultar todos los propietarios
export async function obtenerPropietarios(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT
        p.id_propietario,
        p.tipo_documento,
        p.documento,
        p.nombre,
        p.telefono,
        p.correo,
        p.direccion,
        p.activo,
        COUNT(m.id_mascota)::integer AS total_mascotas
      FROM propietarios p
      LEFT JOIN mascotas m
        ON p.id_propietario = m.id_propietario
      GROUP BY p.id_propietario
      ORDER BY p.nombre
    `);

    res.json({
      success: true,
      propietarios: resultado.rows
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      mensaje: "Error al consultar propietarios"
    });
  }
}

// Consultar un propietario por ID
export async function obtenerPropietarioPorId(req, res) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de propietario inválido"
      });
    }

    const resultado = await pool.query(
      "SELECT * FROM propietarios WHERE id_propietario = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Propietario no encontrado"
      });
    }

    res.json({
      success: true,
      propietario: resultado.rows[0]
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      mensaje: "Error al consultar propietario"
    });
  }
}

export async function crearPropietario(req, res) {
  try {
    const {
      tipo_documento,
      documento,
      nombre,
      telefono,
      correo,
      direccion
    } = req.body;

    if (
      typeof documento !== "string" ||
      typeof nombre !== "string" ||
      typeof telefono !== "string" ||
      !documento.trim() ||
      !nombre.trim() ||
      !telefono.trim()
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Documento, nombre y teléfono son obligatorios"
      });
    }

    if (
      [tipo_documento, correo, direccion].some(
        valor => valor != null && typeof valor !== "string"
      )
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Los campos deben contener texto"
      });
    }

    const datos = {
      tipo_documento: tipo_documento?.trim() || null,
      documento: documento.trim(),
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      correo: correo?.trim() || null,
      direccion: direccion?.trim() || null
    };

    if (
      datos.documento.length > 30 ||
      datos.nombre.length > 120 ||
      datos.telefono.length > 25 ||
      (datos.tipo_documento?.length || 0) > 20 ||
      (datos.correo?.length || 0) > 150 ||
      (datos.direccion?.length || 0) > 200
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Uno o más campos exceden la longitud permitida"
      });
    }

    if (
      datos.correo &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Correo electrónico inválido"
      });
    }

    const resultado = await pool.query(
      `INSERT INTO propietarios
       (tipo_documento, documento, nombre,
        telefono, correo, direccion)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        datos.tipo_documento,
        datos.documento,
        datos.nombre,
        datos.telefono,
        datos.correo,
        datos.direccion
      ]
    );

    return res.status(201).json({
      success: true,
      mensaje: "Propietario registrado correctamente",
      propietario: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        mensaje: "Ya existe un propietario con ese documento"
      });
    }

    console.error("Error al registrar propietario:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al registrar propietario"
    });
  }
}

export async function actualizarPropietario(req, res) {
  try {
    const { id } = req.params;
    const {
      tipo_documento,
      documento,
      nombre,
      telefono,
      correo,
      direccion
    } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID inválido"
      });
    }

    if (
      typeof documento !== "string" ||
      typeof nombre !== "string" ||
      typeof telefono !== "string" ||
      !documento.trim() ||
      !nombre.trim() ||
      !telefono.trim()
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Documento, nombre y teléfono son obligatorios"
      });
    }

    if (
      [tipo_documento, correo, direccion].some(
        valor => valor != null && typeof valor !== "string"
      )
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Los campos opcionales deben contener texto"
      });
    }

    const datos = {
      tipo_documento: tipo_documento?.trim() || null,
      documento: documento.trim(),
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      correo: correo?.trim() || null,
      direccion: direccion?.trim() || null
    };

    if (
      datos.documento.length > 30 ||
      datos.nombre.length > 120 ||
      datos.telefono.length > 25 ||
      (datos.tipo_documento?.length || 0) > 20 ||
      (datos.correo?.length || 0) > 150 ||
      (datos.direccion?.length || 0) > 200
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Uno o más campos exceden la longitud permitida"
      });
    }

    if (
      datos.correo &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Correo electrónico inválido"
      });
    }

    const resultado = await pool.query(
      `UPDATE propietarios
       SET tipo_documento = $1,
           documento = $2,
           nombre = $3,
           telefono = $4,
           correo = $5,
           direccion = $6
       WHERE id_propietario = $7
       RETURNING *`,
      [
        datos.tipo_documento,
        datos.documento,
        datos.nombre,
        datos.telefono,
        datos.correo,
        datos.direccion,
        id
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Propietario no encontrado"
      });
    }

    return res.json({
      success: true,
      mensaje: "Propietario actualizado correctamente",
      propietario: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        mensaje: "Ya existe otro propietario con ese documento"
      });
    }

    console.error("Error al actualizar propietario:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al actualizar propietario"
    });
  }
}

export async function cambiarEstadoPropietario(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID inválido"
      });
    }

    if (typeof activo !== "boolean") {
      return res.status(400).json({
        success: false,
        mensaje: "El campo activo debe ser true o false"
      });
    }

    const resultado = await pool.query(
      `UPDATE propietarios
       SET activo = $1
       WHERE id_propietario = $2
       RETURNING id_propietario, nombre, activo`,
      [activo, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Propietario no encontrado"
      });
    }

    return res.json({
      success: true,
      mensaje: activo
        ? "Propietario activado correctamente"
        : "Propietario desactivado correctamente",
      propietario: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al cambiar estado:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al cambiar el estado"
    });
  }
}

