# Plan de pruebas — Huellitas de Amor

## Alcance y entorno
Backend Express y frontend React; PostgreSQL local para pruebas manuales de integración. Las pruebas automatizadas usan Node.js 22 y dobles de acceso a datos; no requieren credenciales ni modifican la base real. Ejecutar desde `server`: `node --test --experimental-test-coverage --test-coverage-exclude="test/**"`. Desde `client`: `npm run build`.

## Matriz de trazabilidad y caja negra
Ejecutar con cuentas de cada rol y registros de prueba identificables. No utilizar pacientes reales para operaciones destructivas. Anotar fecha, responsable, resultado observado, estado y evidencia; las filas siguientes son casos propuestos, no resultados certificados.

| Caso | RF | Entrada / operación | Resultado esperado | Evidencia / estado |
|---|---|---|---|---|
| CN01 | RF-1 | Registrar propietario válido; repetir documento | Registro persistente; duplicado rechazado | Pendiente de evidencia |
| CN02 | RF-2 | Registrar mascota de propietario activo; peso negativo | Registro válido; peso rechazado | Pendiente de evidencia |
| CN03 | RF-3 | Buscar propietario y mascota existentes e inexistentes | Coincidencias correctas; lista vacía si no existe | Pendiente de evidencia |
| CN04 | RF-4 | Editar teléfono y datos de mascota; recargar | Cambios persistentes | Pendiente de evidencia |
| CN05 | RF-5 | Programar cita futura y repetir horario del veterinario | Cita creada; conflicto rechazado | Pendiente de evidencia |
| CN06 | RF-6 | Consultar agenda y disponibilidad | Citas y horarios correspondientes | Pendiente de evidencia |
| CN07 | RF-7 | Reprogramar y cancelar una cita de prueba | Nuevas fechas y estado correctos | Pendiente de evidencia |
| CN08 | RF-8 | Registrar atención de mascota activa | Atención guardada; cita asociada completada cuando corresponda | Pendiente de evidencia |
| CN09 | RF-9 | Guardar diagnóstico y tratamiento | Datos vinculados a la atención | Pendiente de evidencia |
| CN10 | RF-10 | Consultar historial de mascota atendida | Muestra registros correspondientes | Pendiente de evidencia |
| CN11 | RNF-01 | Login inválido; permiso revocado; sesión anterior al cambio de clave | Acceso rechazado | Pendiente de evidencia |
| CN12 | RNF-02 | Medir tiempos de login, consulta y agenda con datos representativos | Registrar tiempos reales y contrastar con requisito acordado | Pendiente de medición |
| CN13 | RNF-03 | Ejecutar flujo completo por rol sin asistencia | Registrar dificultades y resultado | Pendiente de evidencia |
| CN14 | RNF-04 | Reiniciar aplicación y consultar datos | Información persistente cuando el servicio está disponible | Pendiente de evidencia |
| CN15 | RNF-05 | Crear backup y restaurar en otra BD de prueba | Integridad y recuperación verificadas | Pendiente de evidencia |

## Caja blanca y unitarias
`test/domain.test.js` y `test/modules.test.js`: se ejercitan ramas de validación, errores, permisos y transacciones. Los dobles verifican llamadas parametrizadas, COMMIT, ROLLBACK y liberación de conexión. No validan la ejecución real del SQL ni sustituyen pruebas de integración.

## Definition of Done propuesta
- Criterios de aceptación verificados y evidencia registrada.
- Pruebas automatizadas aprobadas y cobertura reportada con alcance explícito.
- Compilación frontend y CI aprobados.
- Código revisado, documentado y sin credenciales versionadas.
- Pull request revisado y merge confirmado.
- Los defectos abiertos se registran, no se declaran resueltos sin verificación.

## Automatización
`.github/workflows/ci.yml` ejecuta instalación reproducible con npm ci, comprobación sintáctica, pruebas/cobertura y compilación frontend en push y pull request. Publica artefactos del reporte y del frontend. No despliega automáticamente ni usa PostgreSQL real; el despliegue continuo queda fuera de este workflow.
