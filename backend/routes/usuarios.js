const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
router.get('/', (req, res) => {
    req.db.query('SELECT * FROM usuario', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

router.post('/', async (req, res) => {
    const { nombre, email, universidad, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    req.db.query('INSERT INTO usuario (nombre, email, universidad, password) VALUES (?, ?, ?, ?)', 
    [nombre, email, universidad, hashedPassword], 
    (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ id: result.insertId, nombre, email, universidad });
    });
});


module.exports = router;

// POST http://localhost:3000/api/usuarios
// Content-Type: application/json

// {
//   "nombre": "Peperoni",
//   "email": "peperoni@example.com",
//   "universidad": "ucsp",
//   "password": "1234567"
// }

// {
//     "message": "Login successful",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
//   }
  
