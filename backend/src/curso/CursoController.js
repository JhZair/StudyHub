const express = require('express');
const router = express.Router();

// Obtener todos los cursos
router.get('/', async (req, res) => {
  try {
    const [results] = await req.db.query('SELECT * FROM curso');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Agregar un curso
router.post('/', async (req, res) => {
  const { nombre, area } = req.body;
  try {
    const [result] = await req.db.query('INSERT INTO curso (nombre, area) VALUES (?, ?)', [nombre, area]);
    res.status(201).json({ id: result.insertId, nombre, area });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
