const express = require('express');
const session = require('express-session');
const cors = require('cors');
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

const usuarioService = new UsuarioService(new UsuarioRepository(db));
const cursoService = new CursoService(new CursoRepository(db));
const simulacroService = new SimulacroService(new SimulacroRepository(db));

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://studyhubfrontend-5pmm.onrender.com'
];

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*');
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

app.use(session({
  secret: 'mi-secreto-super-simple',
  resave: false,
  saveUninitialized: false,
}));

// Middleware para inyectar la db en cada request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Rutas
app.use('/api/cursos', require('./src/curso/CursoController')(cursoService));
app.use('/api/usuarios', require('./src/usuario/UsuarioController')(usuarioService));
app.use('/api/recursos', require('./src/recurso/RecursoController'));
app.use('/api/simulacros', require('./src/simulacro/SimulacroController')(simulacroService));
app.use('/api/auth', require('./src/usuario/AuthController')(usuarioService));
app.use('/uploads', express.static('uploads'));

// Servir metadata.rdf
app.get('/rdf', (req, res) => {
  const filePath = path.join(__dirname, 'static', 'metadata.rdf');
  res.sendFile(filePath, {
    headers: {
      'Content-Type': 'application/rdf+xml'
    }
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});