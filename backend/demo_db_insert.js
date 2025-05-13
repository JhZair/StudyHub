const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'a',      
  password: 'a',  
  database: 'studyhub',
  multipleStatements: true
});

const sql = fs.readFileSync('database_setup.sql', 'utf8');

connection.connect((err) => {
  if (err) {
    console.error('Connection failed:', err.message);
    console.error(err);
    return;
  }
  console.log('Connected to DB.');

  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Query execution error:', err.message);
      console.error(err);
      return;
    }

    console.log('Database initialized successfully.');
    connection.end();
  });
});
