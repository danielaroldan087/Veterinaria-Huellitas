/** Valida la política común de contraseñas nuevas, sin acceder a infraestructura. */
export function passwordValida(value) {
  return typeof value === 'string' && value.length >= 10 &&
    Buffer.byteLength(value) <= 72 && /[A-Z]/.test(value) &&
    /[a-z]/.test(value) && /[0-9]/.test(value);
}
