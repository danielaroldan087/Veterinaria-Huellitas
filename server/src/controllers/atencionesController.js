
import pool from "../db.js";

// Consultar todas las atenciones
export async function obtenerAtenciones(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT
        a.id_atencion,
        a.id_mascota,
        m.nombre AS mascota,
        m.especie,
        p.nombre AS propietario,
        a.id_veterinario,
        u.nombre AS veterinario,
        a.id_cita,
        a.fecha_atencion,
        a.motivo_consulta,
        a.anamnesis,
        a.examen_fisico,
        a.peso_kg,
        a.temperatura,
        a.observaciones
      FROM atenciones a
      INNER JOIN mascotas m
        ON a.id_mascota = m.id_mascota
      INNER JOIN propietarios p
        ON m.id_propietario = p.id_propietario
      INNER JOIN usuarios u
        ON a.id_veterinario = u.id_usuario
      ORDER BY a.fecha_atencion DESC, a.id_atencion DESC
    `);

    return res.json({
      success: true,
      total: resultado.rowCount,
      atenciones: resultado.rows
    });

  } catch (error) {
    console.error("Error al consultar atenciones:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al consultar atenciones"
    });
  }
}

// Consultar historial clínico de una mascota
export async function obtenerHistorialMascota(req, res) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de mascota inválido"
      });
    }

    const mascota = await pool.query(
      `SELECT
         m.id_mascota,
         m.nombre,
         m.especie,
         m.raza,
         p.nombre AS propietario
       FROM mascotas m
       INNER JOIN propietarios p
         ON m.id_propietario = p.id_propietario
       WHERE m.id_mascota = $1`,
      [id]
    );

    if (mascota.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Mascota no encontrada"
      });
    }

    const atenciones = await pool.query(
      `SELECT
         a.*,
         u.nombre AS veterinario
       FROM atenciones a
       INNER JOIN usuarios u
         ON a.id_veterinario = u.id_usuario
       WHERE a.id_mascota = $1
       ORDER BY a.fecha_atencion DESC, a.id_atencion DESC`,
      [id]
    );

    const ids = atenciones.rows.map(a => a.id_atencion);

    let diagnosticos = [];
    let tratamientos = [];

    if (ids.length > 0) {
      const resultadoDiagnosticos = await pool.query(
        `SELECT *
         FROM diagnosticos
         WHERE id_atencion = ANY($1::integer[])
         ORDER BY id_diagnostico`,
        [ids]
      );

      const resultadoTratamientos = await pool.query(
        `SELECT *
         FROM tratamientos
         WHERE id_atencion = ANY($1::integer[])
         ORDER BY id_tratamiento`,
        [ids]
      );

      diagnosticos = resultadoDiagnosticos.rows;
      tratamientos = resultadoTratamientos.rows;
    }

    const historial = atenciones.rows.map(atencion => ({
      ...atencion,
      diagnosticos: diagnosticos.filter(
        d => d.id_atencion === atencion.id_atencion
      ),
      tratamientos: tratamientos.filter(
        t => t.id_atencion === atencion.id_atencion
      )
    }));

    return res.json({
      success: true,
      mascota: mascota.rows[0],
      total_atenciones: historial.length,
      historial
    });

  } catch (error) {
    console.error("Error al consultar historial:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al consultar historial clínico"
    });
  }
}

export async function crearAtencion(req, res) {
  const {
    id_mascota,
    id_cita,
    motivo_consulta,
    anamnesis,
    examen_fisico,
    peso_kg,
    temperatura,
    observaciones
  } = req.body || {};

  const idValido = valor =>
    Number.isSafeInteger(valor) && valor > 0;

  const textoOpcional = valor =>
    valor == null || typeof valor === "string";

  if (
    !idValido(id_mascota) ||
    typeof motivo_consulta !== "string" ||
    !motivo_consulta.trim()
  ) {
    return res.status(400).json({
      success: false,
      mensaje: "Mascota y motivo de consulta son obligatorios"
    });
  }

  if (id_cita != null && !idValido(id_cita)) {
    return res.status(400).json({
      success: false,
      mensaje: "ID de cita inválido"
    });
  }

  if (
    !textoOpcional(anamnesis) ||
    !textoOpcional(examen_fisico) ||
    !textoOpcional(observaciones)
  ) {
    return res.status(400).json({
      success: false,
      mensaje: "Los campos clínicos deben contener texto"
    });
  }

  if (
    [peso_kg, temperatura].some(
      valor => valor != null &&
        (typeof valor !== "number" ||
         !Number.isFinite(valor))
    ) ||
    (peso_kg != null && peso_kg <= 0)
  ) {
    return res.status(400).json({
      success: false,
      mensaje: "Peso o temperatura inválidos"
    });
  }

  let cliente;

  try {
    cliente = await pool.connect();
    await cliente.query("BEGIN");

    const mascota = await cliente.query(
      `SELECT m.id_mascota
       FROM mascotas m
       JOIN propietarios p
         ON p.id_propietario = m.id_propietario
       WHERE m.id_mascota = $1
         AND m.activo = true
         AND p.activo = true`,
      [id_mascota]
    );

    if (mascota.rowCount === 0) {
      await cliente.query("ROLLBACK");

      return res.status(409).json({
        success: false,
        mensaje: "La mascota o su propietario están inactivos"
      });
    }

    if (id_cita != null) {
      const cita = await cliente.query(
        `SELECT id_cita, id_mascota, id_veterinario,
                estado, fecha_inicio
         FROM citas
         WHERE id_cita = $1
         FOR UPDATE`,
        [id_cita]
      );

      if (cita.rowCount === 0) {
        await cliente.query("ROLLBACK");

        return res.status(404).json({
          success: false,
          mensaje: "Cita no encontrada"
        });
      }

      const datosCita = cita.rows[0];

      if (
        datosCita.id_mascota !== id_mascota ||
        datosCita.id_veterinario !== req.usuario.id_usuario
      ) {
        await cliente.query("ROLLBACK");

        return res.status(403).json({
          success: false,
          mensaje: "La cita no corresponde a la mascota o veterinario"
        });
      }

      if (
        datosCita.estado !== "confirmada" ||
        new Date(datosCita.fecha_inicio) > new Date()
      ) {
        await cliente.query("ROLLBACK");

        return res.status(409).json({
          success: false,
          mensaje: "La cita debe estar confirmada y haber iniciado"
        });
      }
    }

    const resultado = await cliente.query(
      `INSERT INTO atenciones (
         id_mascota,
         id_veterinario,
         id_cita,
         motivo_consulta,
         anamnesis,
         examen_fisico,
         peso_kg,
         temperatura,
         observaciones
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        id_mascota,
        req.usuario.id_usuario,
        id_cita ?? null,
        motivo_consulta.trim(),
        anamnesis?.trim() || null,
        examen_fisico?.trim() || null,
        peso_kg ?? null,
        temperatura ?? null,
        observaciones?.trim() || null
      ]
    );

    if (id_cita != null) {
      await cliente.query(
        `UPDATE citas
         SET estado = 'completada'
         WHERE id_cita = $1`,
        [id_cita]
      );
    }

    await cliente.query("COMMIT");

    return res.status(201).json({
      success: true,
      mensaje: "Atención veterinaria registrada correctamente",
      atencion: resultado.rows[0]
    });

  } catch (error) {
    try {
      if (cliente) await cliente.query("ROLLBACK");
    } catch (e) {
      console.error("Error al revertir:", e.message);
    }

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        mensaje: "Esta cita ya tiene una atención registrada"
      });
    }

    if (error.code === "23503" || error.code === "23514") {
      return res.status(400).json({
        success: false,
        mensaje: "Los datos no cumplen las restricciones"
      });
    }

    console.error("Error al crear atención:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al registrar la atención"
    });

  } finally {
    cliente?.release();
  }
}

export async function crearDiagnostico(req, res) {
  try {
    const { id } = req.params;
    const { descripcion, observaciones } = req.body || {};

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de atención inválido"
      });
    }

    if (
      typeof descripcion !== "string" ||
      !descripcion.trim() ||
      (observaciones != null &&
       typeof observaciones !== "string")
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Descripción del diagnóstico inválida"
      });
    }

    const resultado = await pool.query(
      `INSERT INTO diagnosticos (
         id_atencion,
         descripcion,
         observaciones
       )
       SELECT a.id_atencion, $2, $3
       FROM atenciones a
       WHERE a.id_atencion = $1
         AND a.id_veterinario = $4
       RETURNING *`,
      [
        id,
        descripcion.trim(),
        observaciones?.trim() || null,
        req.usuario.id_usuario
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Atención no encontrada o no asignada a este veterinario"
      });
    }

    return res.status(201).json({
      success: true,
      mensaje: "Diagnóstico registrado correctamente",
      diagnostico: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al crear diagnóstico:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al registrar diagnóstico"
    });
  }
}

export async function crearTratamiento(req, res) {
  try {
    const { id } = req.params;

    const {
      medicamento,
      dosis,
      frecuencia,
      duracion,
      indicaciones,
      recomendaciones
    } = req.body || {};

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        mensaje: "ID de atención inválido"
      });
    }

    const campos = [
      medicamento,
      dosis,
      frecuencia,
      duracion,
      indicaciones,
      recomendaciones
    ];

    if (campos.some(
      valor => valor != null && typeof valor !== "string"
    )) {
      return res.status(400).json({
        success: false,
        mensaje: "Los campos del tratamiento deben contener texto"
      });
    }

    if (
      (medicamento?.length || 0) > 150 ||
      (dosis?.length || 0) > 100 ||
      (frecuencia?.length || 0) > 100 ||
      (duracion?.length || 0) > 100
    ) {
      return res.status(400).json({
        success: false,
        mensaje: "Uno o más campos exceden la longitud permitida"
      });
    }

    if (!medicamento?.trim() && !indicaciones?.trim()) {
      return res.status(400).json({
        success: false,
        mensaje: "Debes indicar un medicamento o una indicación"
      });
    }

    const resultado = await pool.query(
      `INSERT INTO tratamientos (
         id_atencion,
         medicamento,
         dosis,
         frecuencia,
         duracion,
         indicaciones,
         recomendaciones
       )
       SELECT
         a.id_atencion, $2, $3, $4, $5, $6, $7
       FROM atenciones a
       WHERE a.id_atencion = $1
         AND a.id_veterinario = $8
       RETURNING *`,
      [
        id,
        medicamento?.trim() || null,
        dosis?.trim() || null,
        frecuencia?.trim() || null,
        duracion?.trim() || null,
        indicaciones?.trim() || null,
        recomendaciones?.trim() || null,
        req.usuario.id_usuario
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Atención no encontrada o no asignada a este veterinario"
      });
    }

    return res.status(201).json({
      success: true,
      mensaje: "Tratamiento registrado correctamente",
      tratamiento: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al crear tratamiento:", error.message);

    return res.status(500).json({
      success: false,
      mensaje: "Error interno al registrar tratamiento"
    });
  }
}
