const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const cors = require('cors'); 
require('dotenv').config();
const path = require('path');

const app = express(); 

const allowedOrigins = [
  'http://localhost:5173', 
  'https://studyhubfrontend-5pmm.onrender.com'
];

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

// Middlewares necesarios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mi-secreto-super-simple',
  resave: false,
  saveUninitialized: false,
}));

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,      
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME  
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Hacer la db disponible en las rutas
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

// app.get('static/metadata.rdf', (req, res) => {
//   res.sendFile(path.join(__dirname, 'static/metadata.rdf'), {
//     headers: {
//       'Content-Type': 'application/rdf+xml' // Tipo MIME para RDF/XML
//     }
//   });
// });

//Ruta GET personalizada para servir maetadata.rdf
app.get('/rdf', (req, res) => {
  const filePath = path.join(__dirname, 'static', 'metadata.rdf');
  res.sendFile(filePath, {
    headers: {
      'Content-Type': 'application/rdf+xml'
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});