const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const db = require('./src/config/database');

const UsuarioRepository = require('./src/usuario/UsuarioRepository');
const UsuarioService = require('./src/usuario/UsuarioService');
const CursoRepository = require('./src/curso/CursoRepository');
const CursoService = require('./src/curso/CursoService');
const SimulacroRepository = require('./src/simulacro/SimulacroRepository');
const SimulacroService = require('./src/simulacro/SimulacroService');
const RecursoRepository = require('./src/recurso/RecursoRepository');
const RecursoService = require('./src/recurso/RecursoService');
const crearRecursoRouter = require('./src/recurso/RecursoController');
const manejadorErrores = require('./src/shared/manejadorErrores');

const app = express();

// 1. Ocultar la cabecera X-Powered-By y aplicar cabeceras de seguridad
app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Permite servir imágenes/archivos a frontend en otro dominio
}));

const allowedOrigins = [
  'http://localhost:5173',
  'https://studyhubfrontend-5pmm.onrender.com'
];

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 2. Mover express.static antes de las sesiones (SonarQube S8441)
app.use('/uploads', express.static('uploads'));

// 3. Configuración segura de CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Configuración segura de sesión (Secreto en .env + SameSite Lax + HttpOnly)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_por_defecto_desarrollo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Instanciamiento de capas
const usuarioService = new UsuarioService(new UsuarioRepository(db));
const cursoService = new CursoService(new CursoRepository(db));
const simulacroService = new SimulacroService(new SimulacroRepository(db));
const recursoService = new RecursoService(new RecursoRepository(db));

// Rutas
app.use('/api/cursos', require('./src/curso/CursoController')(cursoService));
app.use('/api/usuarios', require('./src/usuario/UsuarioController')(usuarioService));
app.use('/api/recursos', crearRecursoRouter(recursoService));
app.use('/api/simulacros', require('./src/simulacro/SimulacroController')(simulacroService));
app.use('/api/auth', require('./src/usuario/AuthController')(usuarioService));

// Servir metadata.rdf
app.get('/rdf', (req, res) => {
  const filePath = path.join(__dirname, 'static', 'metadata.rdf');
  res.sendFile(filePath, {
    headers: {
      'Content-Type': 'application/rdf+xml'
    }
  });
});

// Manejo de errores
app.use(manejadorErrores);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});