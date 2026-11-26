# Huellitas de Amor — sistema de gestión de servicios veterinarios

Proyecto académico de Ingeniería de Software. Equipo: Daniela Roldán Lopera y Manuela Echavarría Zapata, según el informe original.

Centraliza propietarios, mascotas, citas, atenciones, diagnósticos, tratamientos e historial clínico. Incluye administración de usuarios, roles, permisos, reportes y configuración.

## Tecnologías y arquitectura
React + Vite (cliente), Node.js + Express (API REST), PostgreSQL (persistencia), JWT y bcrypt (autenticación), Nodemailer (recuperación de contraseña), GitHub Actions (CI). Arquitectura cliente-servidor con backend monolítico modular y separación por capas; el flujo de autenticación incluye servicio y repositorio específicos.

## Requisitos e instalación
- Node.js 22 (versión usada en el workflow), npm, PostgreSQL y Git.
- Clonar el repositorio: `git clone https://github.com/danielaroldan087/Veterinaria-Huellitas.git`.
- Para una instalación nueva, crear una BD PostgreSQL vacía y ejecutar `database/schema.sql`. Utilizar `database/seed.sql` solo en un ambiente nuevo/de prueba, revisando los datos y credenciales iniciales. Si se restaura un backup completo, no volver a ejecutar estos scripts.
- En `server`, ejecutar `npm ci`; en `client`, ejecutar `npm ci`. Nodemailer debe estar incluido en package.json y package-lock.json del servidor.
- Crear `server/.env` con valores propios, sin subirlo a GitHub:

```dotenv
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_bd
DB_USER=postgres
DB_PASSWORD=REEMPLAZAR
JWT_SECRET=REEMPLAZAR_CON_SECRETO_ALEATORIO
JWT_EXPIRES_IN=2h
FRONTEND_URL=http://localhost:5173
# SMTP opcional para recuperación real
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=correo_autorizado
SMTP_PASSWORD=REEMPLAZAR
SMTP_FROM=correo_autorizado
```

- Crear `client/.env`:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

- Terminal 1: `cd server`, `npm run dev`.
- Terminal 2: `cd client`, `npm run dev`.
- Abrir la URL indicada por Vite. Comprobar `/api/health` y `/api/database/health` en el backend. Usar cuentas activas de los tres roles previamente configuradas en PostgreSQL. No compartir contraseñas en la entrega pública.

## Roles
| Rol | Responsabilidades |
|---|---|
| Recepcionista | Propietarios, mascotas, citas, búsqueda, perfil |
| Veterinario | Agenda propia, pacientes, atención, diagnóstico, tratamiento, historial e informes |
| Administrador | Usuarios, permisos, estadísticas y configuración |

## Pruebas y automatización
Desde `server`: `node --test --experimental-test-coverage --test-coverage-exclude="test/**"`.
Desde `client`: `npm run build`.
El workflow `.github/workflows/ci.yml` ejecuta instalación reproducible, sintaxis, pruebas, cobertura y compilación. Publica artefactos; no despliega a producción. Las 51 pruebas del reporte adjunto se ejecutaron en una reconstrucción del proyecto, usando dobles de acceso a datos; no certifican la BD real ni el último commit remoto.

## Documentación
- `docs/arquitectura-y-solid.md`: decisiones y ejemplos técnicos.
- `docs/plan-pruebas.md`: trazabilidad, casos y DoD.
- La evidencia local, el backup y la validación remota deben conservarse por separado, sin credenciales ni datos personales públicos.

## Límites conocidos
Cobertura parcial del backend; SMTP requiere configuración real; algunos ajustes de configuración y detalles visuales de Figma no están completamente aplicados; no hay despliegue continuo configurado. No se afirma disponibilidad de producción ni cumplimiento de rendimiento sin mediciones.
