
import bcrypt from "bcrypt";
import pool from "../src/db.js";

const usuarios = [
  { nombre: "Administrador Principal", correo: "admin@huellitas.test", rol: "administrador" },
  { nombre: "Administrador Auxiliar", correo: "admin2@huellitas.test", rol: "administrador" },
  { nombre: "Administrador General", correo: "admin3@huellitas.test", rol: "administrador" },

  { nombre: "Laura Gómez", correo: "laura@huellitas.test", rol: "recepcionista" },
  { nombre: "Camila Torres", correo: "camila@huellitas.test", rol: "recepcionista" },
  { nombre: "Andrés Ruiz", correo: "andres@huellitas.test", rol: "recepcionista" },

  { nombre: "Dra. Valentina Pérez", correo: "valentina@huellitas.test", rol: "veterinario" },
  { nombre: "Dr. Sebastián Rojas", correo: "sebastian@huellitas.test", rol: "veterinario" },
  { nombre: "Dra. Mariana López", correo: "mariana@huellitas.test", rol: "veterinario" }
];

async function crearUsuarios() {
  const client = await pool.connect();

  try {
    const password = process.env.SEED_PASSWORD;

    if (!password || password.length < 12) {
      throw new Error("Configura SEED_PASSWORD con al menos 12 caracteres");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await client.query("BEGIN");

    for (const usuario of usuarios) {
      await client.query(
        `INSERT INTO usuarios (nombre, correo, id_rol, password_hash)
         SELECT $1, $2, id_rol, $3
         FROM roles
         WHERE nombre = $4
         ON CONFLICT (correo) DO NOTHING`,
        [usuario.nombre, usuario.correo, passwordHash, usuario.rol]
      );
    }

    await client.query("COMMIT");
    console.log("Usuarios de prueba creados correctamente");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

crearUsuarios();
