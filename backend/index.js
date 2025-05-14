const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const cors = require('cors'); 
require('dotenv').config();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});