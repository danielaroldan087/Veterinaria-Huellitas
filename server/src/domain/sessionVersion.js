import { createHmac } from 'node:crypto';
/** Vincula la sesión al hash vigente, invalidándola cuando cambia la contraseña. */
export function sessionVersion(hash, secret) {
  return createHmac('sha256', secret).update(hash).digest('hex');
}
