const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');

const app = express(); // 🔧 Esto iba antes de usar app.use

// Middlewares necesarios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mi-secreto-super-simple',
  resave: false,
  saveUninitialized: false,
}));

const port = 3000;

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'a',      
  password: 'a',  
  database: 'studyhub'   
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

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
