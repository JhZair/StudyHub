const express = require('express');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Registrar usuario
router.post('/', (req, res) => {
  const db = req.db;
  const { nombre, email, universidad, password } = req.body;

  db.query(
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
