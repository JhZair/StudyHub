const express = require('express');
const router = express.Router();

// Obtener todos los cursos
router.get('/', (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM curso', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Agregar un curso
router.post('/', (req, res) => {
  const db = req.db;
  const { nombre, area } = req.body;
  db.query('INSERT INTO curso (nombre, area) VALUES (?, ?)', [nombre, area], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, nombre, area });
  });
});

module.exports = router;
