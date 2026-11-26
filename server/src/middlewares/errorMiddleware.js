import { AppError } from '../errors/AppError.js';
/** Evita exponer detalles internos en errores propagados por Express. */
export function errorMiddleware(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof AppError) return res.status(error.status).json({success:false,mensaje:error.message});
  if (error.type === 'entity.parse.failed') return res.status(400).json({success:false,mensaje:'JSON inválido'});
  console.error('Error interno:', error.name);
  return res.status(500).json({success:false,mensaje: req.path === '/api/auth/login' ? 'Error interno al iniciar sesión' : 'Error interno del servidor'});
}
