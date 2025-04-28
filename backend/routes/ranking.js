const express = require('express');
const router = express.Router();

// Obtener todos los rankings
router.get('/', (req, res) => {
    req.db.query('SELECT * FROM ranking', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Agregar ranking
router.post('/', (req, res) => {
    const { id_usuario, nivel } = req.body;
    req.db.query(
        'INSERT INTO ranking (id_usuario, nivel) VALUES (?, ?)',
        [id_usuario, nivel],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ id: result.insertId });
        }
    );
});

module.exports = router;
