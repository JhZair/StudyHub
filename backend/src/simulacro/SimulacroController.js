const express = require('express');
const router = express.Router();

// Obtener todos los simulacros
router.get('/', async (req, res) => {
  try {
    const [results] = await req.db.query('SELECT * FROM simulacros_examenes');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Agregar simulacro
router.post('/', async (req, res) => {
  const { duracion, preguntas, puntaje, id_curso, id_usuario } = req.body;
  try {
    const [result] = await req.db.query(
      'INSERT INTO simulacros_examenes (duracion, preguntas, puntaje, id_curso, id_usuario) VALUES (?, ?, ?, ?, ?)',
      [duracion, preguntas, puntaje, id_curso, id_usuario]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
