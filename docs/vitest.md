# Pruebas unitarias con Vitest — Huellitas de Amor

## Instalación (desde server)

Requiere Node.js 22 (la misma versión usada por CI). Conservar las dependencias existentes y el lockfile actualizado por npm.

```powershell
npm install -D vitest@3 @vitest/coverage-v8@3
npm pkg set 'scripts.test=vitest run' 'scripts.test:coverage=vitest run --coverage' 'scripts.test:watch=vitest'
npm test
npm run test:coverage
```

## Alcance

94 casos previstos: 18 de dominio, 33 de módulos y 43 adicionales. Los primeros 51 adaptan las pruebas de node:test; se mantienen los archivos originales, pero la configuración de Vitest solo incluye test-vitest. Para correr las antiguas explícitamente: `node --test test/domain.test.js test/modules.test.js`.

- Dominio: políticas de contraseñas, versión de sesión, servicio de login, excepciones.
- Módulos: propietarios, mascotas, citas, atenciones, autenticación, permisos, transacciones.
- Ampliación: todas las funciones exportadas por los seis controladores tienen al menos un caso; repositorio de usuarios, informes, perfil, recuperación, administración y consulta de veterinarios. Los handlers de rutas se prueban directamente, sin ejecutar la cadena HTTP completa.
- PostgreSQL está simulado mediante vi.mock; no se usa la base real ni se envían correos.

No equivale a probar todas las funciones internas, todas las ramas, el frontend React o la integración real de PostgreSQL. Revisar coverage/index.html, especialmente funciones y líneas no cubiertas, y ampliar casos donde corresponda. Las pruebas de humo y su Excel son un entregable separado.

## Evidencias y estado

Sintaxis JavaScript comprobada. Ejecución Vitest y cobertura pendientes de verificar localmente porque el entorno de preparación no tiene acceso al registro npm. No se certifican aprobaciones ni porcentajes sin ejecutar.


