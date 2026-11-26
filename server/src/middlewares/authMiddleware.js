import { sessionVersion } from "../domain/sessionVersion.js";

import jwt from "jsonwebtoken";
import pool from "../db.js";

export async function verificarToken(req, res, next) {
  const autorizacion = req.headers.authorization;

  if (!autorizacion?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      mensaje: "Token de acceso requerido"
    });
  }

  try {
    const token = autorizacion.slice(7);

    const datos = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    const resultado = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.activo, u.password_hash, u.id_rol,
              r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.id_usuario = $1`,
      [datos.sub]
    );

    const usuario = resultado.rows[0];

    if (!usuario?.activo) {
      return res.status(401).json({
        success: false,
        mensaje: "Cuenta no autorizada"
      });
    }

    const version=sessionVersion(usuario.password_hash, process.env.JWT_SECRET);
    if(datos.version!==version)return res.status(401).json({mensaje:"Sesión expirada. Inicia sesión nuevamente"});
    delete usuario.password_hash;
    req.usuario = usuario;
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        mensaje: "Token inválido o expirado"
      });
    }

    console.error("Error de autenticación:", error.message);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno de autenticación"
    });
  }
}

export function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        mensaje: "No tienes permisos para esta operación"
      });
    }

    next();
  };
}

export function exigirPermiso(codigo){return async(req,res,next)=>{try{const r=await pool.query('SELECT 1 FROM rol_permisos rp JOIN permisos p USING(id_permiso) WHERE rp.id_rol=$1 AND p.codigo=$2',[req.usuario.id_rol,codigo]);if(!r.rowCount)return res.status(403).json({mensaje:'Permiso no asignado: '+codigo});next();}catch(e){res.status(500).json({mensaje:'No se pudo verificar el permiso'});}};}
