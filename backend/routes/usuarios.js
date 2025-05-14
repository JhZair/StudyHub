const express = require('express');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', (req, res) => {
    req.db.query('SELECT * FROM usuario', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre, email, universidad, password } = req.body;

    req.db.query(
        'INSERT INTO usuario (nombre, email, universidad, password) VALUES (?, ?, ?, ?)',
        [nombre, email, universidad, password],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Ya existe una cuenta con ese correo electrónico' });
                }
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(201).json({ id: result.insertId, nombre, email, universidad });
        }
    );
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
  
