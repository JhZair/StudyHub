const express = require('express');
const router = express.Router();

// Obtener todos los recursos
router.get('/', (req, res) => {
    req.db.query('SELECT * FROM recursos', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Agregar recurso
router.post('/', (req, res) => {
    const { titulo, descripcion, tipo, archivo, id_curso, id_usuario } = req.body;
    req.db.query(
        'INSERT INTO recursos (titulo, descripcion, tipo, archivo, id_curso, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
        [titulo, descripcion, tipo, archivo, id_curso, id_usuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ id: result.insertId, titulo });
        }
    );
});

module.exports = router;

// GET http://localhost:3000/api/recursos

// GET http://localhost:3000/api/recursos
// Authorization: Bearer <your_token_here>
// With our token
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
// aka Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...



