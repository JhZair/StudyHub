const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const db = require('./db'); // 👉 nuevo: importamos el pool

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
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/recursos', require('./routes/recursos'));
app.use('/api/simulacros', require('./routes/simulacros'));
app.use('/api/ranking', require('./routes/ranking'));
app.use('/api/auth', require('./routes/auth'));
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
