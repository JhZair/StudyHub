const express = require('express');
const router = express.Router();

// Obtener todos los simulacros
router.get('/', (req, res) => {
    req.db.query('SELECT * FROM simulacros_examenes', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Agregar simulacro
router.post('/', (req, res) => {
    const { duracion, preguntas, puntaje, id_curso, id_usuario } = req.body;
    req.db.query(
        'INSERT INTO simulacros_examenes (duracion, preguntas, puntaje, id_curso, id_usuario) VALUES (?, ?, ?, ?, ?)',
        [duracion, preguntas, puntaje, id_curso, id_usuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ id: result.insertId });
        }
    );
});

module.exports = router;
