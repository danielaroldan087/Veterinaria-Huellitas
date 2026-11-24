-- Datos ficticios para desarrollo: Veterinaria Huellitas de Amor
-- Ejecutar una sola vez en la base Veterinaria, después de schema.sql.
-- Requiere los tres roles existentes. No crea cuentas de acceso ni contraseñas.
BEGIN;
DO $$ BEGIN
 IF (SELECT COUNT(*) FROM roles WHERE nombre IN ('administrador','recepcionista','veterinario')) <> 3 THEN
  RAISE EXCEPTION 'Faltan roles requeridos';
 END IF;
 IF EXISTS (SELECT 1 FROM propietarios WHERE documento LIKE 'DEMO-%') THEN
  RAISE EXCEPTION 'Los datos DEMO ya fueron cargados';
 END IF;
END $$;

INSERT INTO permisos (codigo, descripcion) VALUES
('usuarios.ver','Consultar usuarios'),('usuarios.crear','Registrar usuarios'),('usuarios.editar','Modificar usuarios'),
('roles.gestionar','Gestionar roles y permisos'),('propietarios.ver','Consultar propietarios'),
('propietarios.crear','Registrar propietarios'),('propietarios.editar','Modificar propietarios'),
('mascotas.ver','Consultar mascotas'),('mascotas.crear','Registrar mascotas'),('mascotas.editar','Modificar mascotas'),
('citas.ver','Consultar citas'),('citas.gestionar','Crear y modificar citas'),
('atenciones.ver','Consultar atenciones'),('atenciones.crear','Registrar atenciones'),
('informes.generar','Generar informes')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO rol_permisos (id_rol,id_permiso)
SELECT r.id_rol,p.id_permiso FROM roles r CROSS JOIN permisos p
WHERE r.nombre='administrador'
 OR (r.nombre='recepcionista' AND p.codigo IN
 ('propietarios.ver','propietarios.crear','propietarios.editar','mascotas.ver','mascotas.crear','mascotas.editar','citas.ver','citas.gestionar'))
 OR (r.nombre='veterinario' AND p.codigo IN
 ('propietarios.ver','mascotas.ver','citas.ver','atenciones.ver','atenciones.crear','informes.generar'))
ON CONFLICT DO NOTHING;

INSERT INTO configuracion_sistema (clave,valor,descripcion) VALUES
('nombre_veterinaria','Huellitas de Amor','Nombre visible del sistema'),
('zona_horaria','America/Bogota','Zona horaria de operación'),
('duracion_cita_minutos','30','Duración sugerida de citas'),
('moneda','COP','Moneda de referencia'),
('recordatorios_habilitados','false','Recordatorios aún no implementados')
ON CONFLICT (clave) DO NOTHING;
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0001','Ana Gómez','3001000001','demo.propietario1@example.com','Dirección ficticia 1');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0002','Carlos Pérez','3001000002','demo.propietario2@example.com','Dirección ficticia 2');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0003','María Rodríguez','3001000003','demo.propietario3@example.com','Dirección ficticia 3');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0004','Luis Martínez','3001000004','demo.propietario4@example.com','Dirección ficticia 4');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0005','Sofía López','3001000005','demo.propietario5@example.com','Dirección ficticia 5');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0006','Jorge García','3001000006','demo.propietario6@example.com','Dirección ficticia 6');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0007','Valentina Hernández','3001000007','demo.propietario7@example.com','Dirección ficticia 7');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0008','Andrés Ramírez','3001000008','demo.propietario8@example.com','Dirección ficticia 8');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0009','Paula Torres','3001000009','demo.propietario9@example.com','Dirección ficticia 9');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0010','Diego Díaz','3001000010','demo.propietario10@example.com','Dirección ficticia 10');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0011','Camila Vargas','3001000011','demo.propietario11@example.com','Dirección ficticia 11');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0012','Mateo Castro','3001000012','demo.propietario12@example.com','Dirección ficticia 12');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0013','Laura Moreno','3001000013','demo.propietario13@example.com','Dirección ficticia 13');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0014','Felipe Rojas','3001000014','demo.propietario14@example.com','Dirección ficticia 14');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0015','Daniela Jiménez','3001000015','demo.propietario15@example.com','Dirección ficticia 15');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0016','Santiago Ortiz','3001000016','demo.propietario16@example.com','Dirección ficticia 16');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0017','Natalia Ruiz','3001000017','demo.propietario17@example.com','Dirección ficticia 17');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0018','Sebastián Mendoza','3001000018','demo.propietario18@example.com','Dirección ficticia 18');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0019','Juliana Silva','3001000019','demo.propietario19@example.com','Dirección ficticia 19');
INSERT INTO propietarios (tipo_documento,documento,nombre,telefono,correo,direccion) VALUES ('CC','DEMO-0020','Ricardo Herrera','3001000020','demo.propietario20@example.com','Dirección ficticia 20');

INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0001'),'Max','Perro','Mestizo','Macho',DATE '2022-01-01' + 24,'Variado',3.10,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0002'),'Luna','Perro','Mestizo','Hembra',DATE '2022-01-01' + 48,'Variado',3.70,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0003'),'Rocky','Gato','Doméstico de pelo corto','Macho',DATE '2022-01-01' + 72,'Variado',4.30,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0004'),'Nala','Perro','Mestizo','Hembra',DATE '2022-01-01' + 96,'Variado',4.90,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0005'),'Toby','Perro','Mestizo','Macho',DATE '2022-01-01' + 120,'Variado',5.50,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0006'),'Milo','Gato','Doméstico de pelo corto','Hembra',DATE '2022-01-01' + 144,'Variado',6.10,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0007'),'Kira','Perro','Mestizo','Macho',DATE '2022-01-01' + 168,'Variado',6.70,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0008'),'Simba','Perro','Mestizo','Hembra',DATE '2022-01-01' + 192,'Variado',7.30,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0009'),'Coco','Gato','Doméstico de pelo corto','Macho',DATE '2022-01-01' + 216,'Variado',7.90,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0010'),'Bella','Perro','Mestizo','Hembra',DATE '2022-01-01' + 240,'Variado',8.50,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0011'),'Bruno','Perro','Mestizo','Macho',DATE '2022-01-01' + 264,'Variado',9.10,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0012'),'Mia','Gato','Doméstico de pelo corto','Hembra',DATE '2022-01-01' + 288,'Variado',9.70,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0013'),'Zeus','Perro','Mestizo','Macho',DATE '2022-01-01' + 312,'Variado',10.30,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0014'),'Lola','Perro','Mestizo','Hembra',DATE '2022-01-01' + 336,'Variado',10.90,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0015'),'Thor','Gato','Doméstico de pelo corto','Macho',DATE '2022-01-01' + 360,'Variado',11.50,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0016'),'Nina','Perro','Mestizo','Hembra',DATE '2022-01-01' + 384,'Variado',12.10,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0017'),'Rex','Perro','Mestizo','Macho',DATE '2022-01-01' + 408,'Variado',12.70,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0018'),'Kiwi','Gato','Doméstico de pelo corto','Hembra',DATE '2022-01-01' + 432,'Variado',13.30,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0019'),'Doki','Perro','Mestizo','Macho',DATE '2022-01-01' + 456,'Variado',13.90,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0020'),'Canela','Perro','Mestizo','Hembra',DATE '2022-01-01' + 480,'Variado',14.50,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0001'),'Chispa','Gato','Doméstico de pelo corto','Macho',DATE '2022-01-01' + 504,'Variado',15.10,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0002'),'Oreo','Perro','Mestizo','Hembra',DATE '2022-01-01' + 528,'Variado',15.70,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0003'),'Pelusa','Perro','Mestizo','Macho',DATE '2022-01-01' + 552,'Variado',16.30,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0004'),'Runa','Gato','Doméstico de pelo corto','Hembra',DATE '2022-01-01' + 576,'Variado',16.90,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0005'),'Bongo','Perro','Mestizo','Macho',DATE '2022-01-01' + 600,'Variado',17.50,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0006'),'Tina','Perro','Mestizo','Hembra',DATE '2022-01-01' + 624,'Variado',18.10,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0007'),'Pecas','Gato','Doméstico de pelo corto','Macho',DATE '2022-01-01' + 648,'Variado',18.70,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0008'),'Dante','Perro','Mestizo','Hembra',DATE '2022-01-01' + 672,'Variado',19.30,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0009'),'Moka','Perro','Mestizo','Macho',DATE '2022-01-01' + 696,'Variado',19.90,'Registro ficticio de prueba');
INSERT INTO mascotas (id_propietario,nombre,especie,raza,sexo,fecha_nacimiento,color,peso_kg,observaciones) VALUES ((SELECT id_propietario FROM propietarios WHERE documento='DEMO-0010'),'Nube','Gato','Doméstico de pelo corto','Hembra',DATE '2022-01-01' + 720,'Variado',20.50,'Registro ficticio de prueba');

-- No se insertan citas/atenciones/informes todavía: requieren usuarios veterinarios
-- con contraseñas hasheadas y permisos comprobables.
COMMIT;

-- Verificación
SELECT 'propietarios' AS tabla, COUNT(*) AS registros FROM propietarios
UNION ALL SELECT 'mascotas',COUNT(*) FROM mascotas
UNION ALL SELECT 'permisos',COUNT(*) FROM permisos
UNION ALL SELECT 'rol_permisos',COUNT(*) FROM rol_permisos
UNION ALL SELECT 'configuracion_sistema',COUNT(*) FROM configuracion_sistema;
