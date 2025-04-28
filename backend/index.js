const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// use .env file to hide xd
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'a',      
  password: 'a',  
  database: 'express_db'   
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected to MySQL as id ' + connection.threadId);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Query error: ' + err.stack);
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);  
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
