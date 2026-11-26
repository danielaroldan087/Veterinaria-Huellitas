/** Error esperado de negocio con código HTTP y mensaje público. */
export class AppError extends Error {
  constructor(status, message) { super(message); this.name = 'AppError'; this.status = status; }
}
