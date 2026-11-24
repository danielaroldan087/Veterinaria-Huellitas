
import pool from "../db.js";

// Consultar todas las citas
export async function obtenerCitas(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT
        c.id_cita,
        c.id_mascota,
        m.nombre AS mascota,
        m.especie,
        p.nombre AS propietario,
        c.id_veterinario,
        u.nombre AS veterinario,
        c.id_creador,
        c.fecha_inicio,
        c.fecha_fin,
        c.motivo,
        c.estado,
        c.observaciones,
        c.fecha_creacion
      FROM citas c
      INNER JOIN mascotas m
        ON c.id_mascota = m.id_mascota
      INNER JOIN propietarios p
        ON m.id_propietario = p.id_propietario
      LEFT JOIN usuarios u
        ON c.id_veterinario = u.id_usuario
      ORDER BY c.fecha_inicio DESC
    `);

    return res.json({
      success: true,
      total: resultado.rowCount,
      citas: resultado.rows
    });

  } catch (error) {
    console.error("Error al consultar citas:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al consultar citas"
    });
  }
}

// Consultar una cita por ID
export async function obtenerCitaPorId(req, res) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de cita inválido"
      });
    }

    const resultado = await pool.query(`
      SELECT
        c.*,
        m.nombre AS mascota,
        m.especie,
        p.nombre AS propietario,
        u.nombre AS veterinario
      FROM citas c
      INNER JOIN mascotas m
        ON c.id_mascota = m.id_mascota
      INNER JOIN propietarios p
        ON m.id_propietario = p.id_propietario
      LEFT JOIN usuarios u
        ON c.id_veterinario = u.id_usuario
      WHERE c.id_cita = $1
    `, [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Cita no encontrada"
      });
    }

    return res.json({
      success: true,
      cita: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al consultar cita:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al consultar la cita"
    });
  }
}

export async function crearCita(req, res) {
  const cliente = await pool.connect();

  try {
    const {
      id_mascota,
      id_veterinario,
      fecha_inicio,
      fecha_fin,
      motivo,
      observaciones
    } = req.body;

    // Validar campos obligatorios
    if (
      !Number.isSafeInteger(id_mascota) ||
      id_mascota <= 0 ||
      !Number.isSafeInteger(id_veterinario) ||
      id_veterinario <= 0 ||
      typeof motivo !== "string" ||
      !motivo.trim()
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Mascota, veterinario y motivo son obligatorios"
      });
    }

    if (
      observaciones != null &&
      typeof observaciones !== "string"
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Las observaciones deben contener texto"
      });
    }

    // Exigir fechas ISO con zona horaria
    const formatoFecha =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

    if (
      typeof fecha_inicio !== "string" ||
      typeof fecha_fin !== "string" ||
      !formatoFecha.test(fecha_inicio) ||
      !formatoFecha.test(fecha_fin)
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Las fechas deben incluir hora y zona horaria"
      });
    }

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (
      !Number.isFinite(inicio.getTime()) ||
      !Number.isFinite(fin.getTime()) ||
      inicio <= new Date() ||
      fin <= inicio
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "El horario debe ser futuro y la fecha final posterior al inicio"
      });
    }

    await cliente.query("BEGIN");

    // Evitar reservas simultáneas durante la validación
    await cliente.query(
      "SELECT pg_advisory_xact_lock($1, $2)",
      [13, 1]
    );

    // Verificar mascota y propietario
    const mascota = await cliente.query(
      `SELECT m.id_mascota
       FROM mascotas m
       INNER JOIN propietarios p
         ON m.id_propietario = p.id_propietario
       WHERE m.id_mascota = $1
         AND m.activo = true
         AND p.activo = true`,
      [id_mascota]
    );

    if (mascota.rowCount === 0) {
      await cliente.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        mensaje: "La mascota o su propietario no están activos"
      });
    }

    // Verificar veterinario
    const veterinario = await cliente.query(
      `SELECT u.id_usuario
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id_rol
       WHERE u.id_usuario = $1
         AND u.activo = true
         AND r.nombre = 'veterinario'`,
      [id_veterinario]
    );

    if (veterinario.rowCount === 0) {
      await cliente.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        mensaje: "El veterinario no existe o está inactivo"
      });
    }

    // Comprobar conflictos de horario
    const conflicto = await cliente.query(
      `SELECT id_cita
       FROM citas
       WHERE estado IN ('programada', 'confirmada')
         AND (id_veterinario = $1 OR id_mascota = $2)
         AND fecha_inicio < $4::timestamptz
         AND fecha_fin > $3::timestamptz
       LIMIT 1`,
      [id_veterinario, id_mascota, inicio, fin]
    );

    if (conflicto.rowCount > 0) {
      await cliente.query("ROLLBACK");

      return res.status(409).json({
        success: false,
        mensaje: "El veterinario o la mascota ya tienen una cita en ese horario"
      });
    }

    // Guardar la cita
    const resultado = await cliente.query(
      `INSERT INTO citas (
         id_mascota,
         id_veterinario,
         id_creador,
         fecha_inicio,
         fecha_fin,
         motivo,
         estado,
         observaciones
       )
       VALUES ($1, $2, $3, $4, $5, $6, 'programada', $7)
       RETURNING *`,
      [
        id_mascota,
        id_veterinario,
        req.usuario.id_usuario,
        inicio,
        fin,
        motivo.trim(),
        observaciones?.trim() || null
      ]
    );

    await cliente.query("COMMIT");

    return res.status(201).json({
      success: true,
      mensaje: "Cita programada correctamente",
      cita: resultado.rows[0]
    });

  } catch (error) {
    try {
      await cliente.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Error al revertir transacción:", rollbackError.message);
    }

    console.error("Error al programar cita:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al programar la cita"
    });

  } finally {
    cliente.release();
  }
}

const ESTADOS_EDITABLES = ["programada", "confirmada"];

function validarId(id) {
  return /^[1-9]\d*$/.test(String(id));
}

function errorHttp(res, codigo, mensaje) {
  return res.status(codigo).json({
    success: false,
    mensaje
  });
}

function validarFechaISO(valor) {
  if (typeof valor !== "string") return false;

  const formato =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

  if (!formato.test(valor)) return false;

  return Number.isFinite(new Date(valor).getTime());
}

// 1. REPROGRAMAR CITA
export async function reprogramarCita(req, res) {
  const { id } = req.params;
  const { fecha_inicio, fecha_fin } = req.body || {};

  if (!validarId(id)) {
    return errorHttp(res, 400, "ID de cita inválido");
  }

  if (
    !validarFechaISO(fecha_inicio) ||
    !validarFechaISO(fecha_fin)
  ) {
    return errorHttp(
      res, 400,
      "Las fechas deben tener formato ISO y zona horaria"
    );
  }

  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);

  if (inicio <= new Date() || fin <= inicio) {
    return errorHttp(
      res, 400,
      "El nuevo horario debe ser futuro y tener una duración válida"
    );
  }

  let cliente;

  try {
    cliente = await pool.connect();
    await cliente.query("BEGIN");

    // Mismo bloqueo utilizado al crear citas
    await cliente.query(
      "SELECT pg_advisory_xact_lock($1, $2)",
      [13, 1]
    );

    const actual = await cliente.query(
      `SELECT id_cita, id_mascota, id_veterinario, estado
       FROM citas
       WHERE id_cita = $1
       FOR UPDATE`,
      [id]
    );

    if (actual.rowCount === 0) {
      await cliente.query("ROLLBACK");
      return errorHttp(res, 404, "Cita no encontrada");
    }

    const cita = actual.rows[0];

    if (!ESTADOS_EDITABLES.includes(cita.estado)) {
      await cliente.query("ROLLBACK");
      return errorHttp(
        res, 409,
        "No se puede reprogramar una cita finalizada o cancelada"
      );
    }

    // Comprobar que mascota y propietario siguen activos
    const mascota = await cliente.query(
      `SELECT m.id_mascota
       FROM mascotas m
       JOIN propietarios p
         ON p.id_propietario = m.id_propietario
       WHERE m.id_mascota = $1
         AND m.activo = true
         AND p.activo = true`,
      [cita.id_mascota]
    );

    if (mascota.rowCount === 0) {
      await cliente.query("ROLLBACK");
      return errorHttp(
        res, 409,
        "La mascota o su propietario están inactivos"
      );
    }

    if (cita.id_veterinario != null) {
      const veterinario = await cliente.query(
        `SELECT u.id_usuario
         FROM usuarios u
         JOIN roles r ON r.id_rol = u.id_rol
         WHERE u.id_usuario = $1
           AND u.activo = true
           AND r.nombre = 'veterinario'`,
        [cita.id_veterinario]
      );

      if (veterinario.rowCount === 0) {
        await cliente.query("ROLLBACK");
        return errorHttp(
          res, 409,
          "El veterinario asignado no está disponible"
        );
      }
    }

    const conflicto = await cliente.query(
      `SELECT id_cita
       FROM citas
       WHERE id_cita <> $1
         AND estado IN ('programada', 'confirmada')
         AND (
           id_mascota = $2
           OR (
             $3::integer IS NOT NULL
             AND id_veterinario = $3
           )
         )
         AND fecha_inicio < $5::timestamptz
         AND fecha_fin > $4::timestamptz
       LIMIT 1`,
      [
        id,
        cita.id_mascota,
        cita.id_veterinario,
        inicio,
        fin
      ]
    );

    if (conflicto.rowCount > 0) {
      await cliente.query("ROLLBACK");
      return errorHttp(
        res, 409,
        "El nuevo horario presenta un conflicto de agenda"
      );
    }

    const resultado = await cliente.query(
      `UPDATE citas
       SET fecha_inicio = $1,
           fecha_fin = $2,
           estado = 'programada'
       WHERE id_cita = $3
       RETURNING *`,
      [inicio, fin, id]
    );

    await cliente.query("COMMIT");

    return res.json({
      success: true,
      mensaje: "Cita reprogramada correctamente",
      cita: resultado.rows[0]
    });

  } catch (error) {
    if (cliente) {
      try {
        await cliente.query("ROLLBACK");
      } catch (e) {
        console.error("Error al revertir:", e.message);
      }
    }

    console.error("Error al reprogramar:", error.message);
    return errorHttp(res, 500, "Error interno al reprogramar");

  } finally {
    if (cliente) cliente.release();
  }
}

// 2. CONFIRMAR CITA
export async function confirmarCita(req, res) {
  const { id } = req.params;

  if (!validarId(id)) {
    return errorHttp(res, 400, "ID de cita inválido");
  }

  try {
    const resultado = await pool.query(
      `UPDATE citas
       SET estado = 'confirmada'
       WHERE id_cita = $1
         AND estado = 'programada'
       RETURNING *`,
      [id]
    );

    if (resultado.rowCount === 0) {
      return errorHttp(
        res, 409,
        "La cita no existe o no está programada"
      );
    }

    return res.json({
      success: true,
      mensaje: "Cita confirmada correctamente",
      cita: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al confirmar:", error.message);
    return errorHttp(res, 500, "Error interno al confirmar");
  }
}

// 3. CANCELAR CITA
export async function cancelarCita(req, res) {
  const { id } = req.params;
  const { motivo_cancelacion } = req.body || {};

  if (!validarId(id)) {
    return errorHttp(res, 400, "ID de cita inválido");
  }

  if (
    typeof motivo_cancelacion !== "string" ||
    !motivo_cancelacion.trim() ||
    motivo_cancelacion.length > 500
  ) {
    return errorHttp(
      res, 400,
      "Debes indicar un motivo de cancelación de máximo 500 caracteres"
    );
  }

  try {
    const resultado = await pool.query(
      `UPDATE citas
       SET estado = 'cancelada',
           observaciones = CONCAT_WS(
             E'\n',
             NULLIF(observaciones, ''),
             'Cancelación: ' || $2::text
           )
       WHERE id_cita = $1
         AND estado IN ('programada', 'confirmada')
       RETURNING *`,
      [id, motivo_cancelacion.trim()]
    );

    if (resultado.rowCount === 0) {
      return errorHttp(
        res, 409,
        "La cita no existe o ya está finalizada"
      );
    }

    return res.json({
      success: true,
      mensaje: "Cita cancelada correctamente",
      cita: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al cancelar:", error.message);
    return errorHttp(res, 500, "Error interno al cancelar");
  }
}

// 4. COMPLETAR CITA
export async function completarCita(req, res) {
  const { id } = req.params;

  if (!validarId(id)) {
    return errorHttp(res, 400, "ID de cita inválido");
  }

  try {
    const resultado = await pool.query(
      `UPDATE citas
       SET estado = 'completada'
       WHERE id_cita = $1
         AND estado = 'confirmada'
         AND fecha_inicio <= NOW()
         AND (
           $2::text = 'administrador'
           OR id_veterinario = $3
         )
       RETURNING *`,
      [
        id,
        req.usuario.rol,
        req.usuario.id_usuario
      ]
    );

    if (resultado.rowCount === 0) {
      return errorHttp(
        res, 409,
        "No se puede completar: revisa el estado, horario y veterinario asignado"
      );
    }

    return res.json({
      success: true,
      mensaje: "Cita completada correctamente",
      cita: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al completar:", error.message);
    return errorHttp(res, 500, "Error interno al completar");
  }
}
