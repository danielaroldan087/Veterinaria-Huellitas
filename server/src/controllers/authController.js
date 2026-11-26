import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findByEmail } from '../repositories/userRepository.js';
import { createLoginService } from '../services/loginService.js';
import { sessionVersion } from '../domain/sessionVersion.js';
const login = createLoginService({ findByEmail, comparePassword: bcrypt.compare,
  issueToken(usuario) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET no está configurado');
    return jwt.sign({ rol: usuario.rol, version: sessionVersion(usuario.password_hash, secret) }, secret,
      { subject: String(usuario.id_usuario), expiresIn: process.env.JWT_EXPIRES_IN || '2h', algorithm: 'HS256' });
  }
});
/** Traduce la petición HTTP al caso de uso de autenticación. */
export async function iniciarSesion(req, res, next) {
  try { res.json(await login(req.body ?? {})); } catch (error) { next(error); }
}
