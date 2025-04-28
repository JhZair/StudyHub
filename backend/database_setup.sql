-- =============================================
-- PASO 1: Limpieza inicial (eliminar objetos existentes)
-- =============================================

-- Eliminar tablas en orden de dependencia (primero las que tienen FK)
DROP TABLE IF EXISTS ranking;
DROP TABLE IF EXISTS simulacros_examenes;
DROP TABLE IF EXISTS recursos;
DROP TABLE IF EXISTS curso;
DROP TABLE IF EXISTS usuario;

-- =============================================
-- PASO 2: Creación de tablas mejoradas
-- =============================================

-- Tabla CURSO
CREATE TABLE curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    UNIQUE (nombre)
);

-- Tabla USUARIO
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso DATETIME,
    universidad VARCHAR(100)
);

-- Tabla RECURSOS
CREATE TABLE recursos (
    id_recurso INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion VARCHAR(500),
    tipo ENUM('APUNTE', 'EXAMEN', 'PDF', 'WORD'),
    archivo VARCHAR(100),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_curso INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla SIMULACROS_EXAMENES
CREATE TABLE simulacros_examenes (
    id_examen INT AUTO_INCREMENT PRIMARY KEY,
    duracion INT NOT NULL, -- en minutos
    preguntas INT NOT NULL,
    puntaje INT,
    fecha_realizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_curso INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla RANKING
CREATE TABLE ranking (
    id_ranking INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nivel ENUM('Bronce', 'Plata', 'Oro', 'Platino', 'Diamante'),
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    UNIQUE (id_usuario)
);

-- =============================================
-- PASO 3: Insertar datos de ejemplo
-- =============================================

-- Insertar cursos
INSERT INTO curso (nombre, area) VALUES 
    ('Matemáticas I', 'Ciencias Básicas'),
    ('Física General', 'Ciencias Básicas'),
    ('Programación I', 'Ingeniería');

-- Insertar usuarios
INSERT INTO usuario (nombre, email, fecha_registro, ultimo_acceso, universidad) VALUES 
    ('Ana García', 'ana.garcia@example.com', STR_TO_DATE('2023-01-15', '%Y-%m-%d'), STR_TO_DATE('2023-06-20', '%Y-%m-%d'), 'Universidad Nacional'),
    ('Carlos Méndez', 'carlos.mendez@example.com', STR_TO_DATE('2023-03-10', '%Y-%m-%d'), STR_TO_DATE('2023-06-18', '%Y-%m-%d'), 'Universidad Tecnológica'),
    ('Luisa Fernández', 'luisa.fernandez@example.com', STR_TO_DATE('2022-11-05', '%Y-%m-%d'), STR_TO_DATE('2023-06-19', '%Y-%m-%d'), 'Universidad Privada');

-- Insertar recursos
INSERT INTO recursos (titulo, descripcion, tipo, archivo, id_curso, id_usuario) VALUES 
    ('Apuntes de Matemáticas', 'Conceptos básicos de álgebra lineal', 'APUNTE', 'matematicas.pdf', 1, 1),
    ('Examen Final 2022', 'Examen de física con soluciones', 'EXAMEN', 'fisica_examen.pdf', 2, 2);

-- Insertar simulacros
INSERT INTO simulacros_examenes (duracion, preguntas, puntaje, fecha_realizacion, id_curso, id_usuario) VALUES 
    (90, 30, 85, STR_TO_DATE('2023-03-01', '%Y-%m-%d'), 1, 1),
    (120, 40, 92, STR_TO_DATE('2023-03-02', '%Y-%m-%d'), 2, 2),
    (60, 20, 78, STR_TO_DATE('2023-03-03', '%Y-%m-%d'), 3, 3);

-- Insertar ranking
INSERT INTO ranking (id_usuario, nivel) VALUES 
    (1, 'Oro'),
    (2, 'Platino'),
    (3, 'Plata');
