const express = require('express');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [results] = await req.db.query('SELECT * FROM usuario');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Registrar usuario
router.post('/', async (req, res) => {
  const { nombre, email, universidad, password } = req.body;

  try {
    const [result] = await req.db.query(
      'INSERT INTO usuario (nombre, email, universidad, password) VALUES (?, ?, ?, ?)',
      [nombre, email, universidad, password]
    );
    res.status(201).json({ id: result.insertId, nombre, email, universidad });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe una cuenta con ese correo electrónico' });
    }
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;
