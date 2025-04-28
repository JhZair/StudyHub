const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// use .env file to hide xd
const db = mysql.createdb({
  host: 'localhost',
  user: 'a',      
  password: 'a',  
  database: 'express_db'   
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected to MySQL as id ' + db.threadId);
});

// Hacer la db disponible para las rutas
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Importar rutas
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