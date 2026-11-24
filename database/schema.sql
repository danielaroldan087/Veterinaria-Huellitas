
-- HUELLITAS DE AMOR
-- Base de datos: Veterinaria
-- Versión inicial 1.0

BEGIN;

-- 1. ROLES
CREATE TABLE roles (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 2. PERMISOS
CREATE TABLE permisos (
    id_permiso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(80) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 3. ROLES Y PERMISOS
CREATE TABLE rol_permisos (
    id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
    id_permiso INTEGER NOT NULL REFERENCES permisos(id_permiso),
    PRIMARY KEY (id_rol, id_permiso)
);

-- 4. USUARIOS
CREATE TABLE usuarios (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
    nombre VARCHAR(120) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(25),
    password_hash TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RECUPERACIÓN DE CONTRASEÑAS
CREATE TABLE recuperaciones_password (
    id_recuperacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    token_hash TEXT NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMPTZ NOT NULL,
    fecha_uso TIMESTAMPTZ
);

-- 6. PROPIETARIOS
CREATE TABLE propietarios (
    id_propietario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_documento VARCHAR(20),
    documento VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(25) NOT NULL,
    correo VARCHAR(150),
    direccion VARCHAR(200),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MASCOTAS
CREATE TABLE mascotas (
    id_mascota INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propietario INTEGER NOT NULL REFERENCES propietarios(id_propietario),
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(60) NOT NULL,
    raza VARCHAR(100),
    sexo VARCHAR(15),
    fecha_nacimiento DATE,
    color VARCHAR(60),
    peso_kg NUMERIC(7,2) CHECK (peso_kg > 0),
    esterilizado BOOLEAN,
    alergias TEXT,
    observaciones TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CITAS
CREATE TABLE citas (
    id_cita INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_mascota INTEGER NOT NULL REFERENCES mascotas(id_mascota),
    id_veterinario INTEGER REFERENCES usuarios(id_usuario),
    id_creador INTEGER REFERENCES usuarios(id_usuario),
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_fin TIMESTAMPTZ NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'programada'
        CHECK (estado IN (
            'programada', 'confirmada',
            'cancelada', 'completada'
        )),
    observaciones TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (fecha_fin > fecha_inicio)
);

-- 9. ATENCIONES CLÍNICAS
CREATE TABLE atenciones (
    id_atencion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_mascota INTEGER NOT NULL REFERENCES mascotas(id_mascota),
    id_veterinario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    id_cita INTEGER UNIQUE REFERENCES citas(id_cita),
    fecha_atencion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    motivo_consulta TEXT NOT NULL,
    anamnesis TEXT,
    examen_fisico TEXT,
    peso_kg NUMERIC(7,2) CHECK (peso_kg > 0),
    temperatura NUMERIC(4,1),
    observaciones TEXT
);

-- 10. DIAGNÓSTICOS
CREATE TABLE diagnosticos (
    id_diagnostico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_atencion INTEGER NOT NULL REFERENCES atenciones(id_atencion),
    descripcion TEXT NOT NULL,
    observaciones TEXT
);

-- 11. TRATAMIENTOS
CREATE TABLE tratamientos (
    id_tratamiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_atencion INTEGER NOT NULL REFERENCES atenciones(id_atencion),
    medicamento VARCHAR(150),
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    duracion VARCHAR(100),
    indicaciones TEXT,
    recomendaciones TEXT
);

-- 12. INFORMES
CREATE TABLE informes (
    id_informe INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_atencion INTEGER NOT NULL REFERENCES atenciones(id_atencion),
    id_generador INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    contenido TEXT NOT NULL,
    fecha_generacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CONFIGURACIÓN
CREATE TABLE configuracion_sistema (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion TEXT,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_mascotas_propietario
ON mascotas(id_propietario);

CREATE INDEX idx_citas_fecha
ON citas(fecha_inicio);

CREATE INDEX idx_citas_veterinario
ON citas(id_veterinario, fecha_inicio);

CREATE INDEX idx_atenciones_mascota
ON atenciones(id_mascota, fecha_atencion);

-- ROLES INICIALES
INSERT INTO roles (nombre, descripcion) VALUES
('administrador', 'Administración del sistema'),
('recepcionista', 'Gestión de propietarios, mascotas y citas'),
('veterinario', 'Gestión de atenciones e historial clínico');

COMMIT;
