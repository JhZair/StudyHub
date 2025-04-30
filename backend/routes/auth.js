const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const sql = 'SELECT id_usuario, nombre, email FROM usuario WHERE email = ? AND password = ?';

  req.db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error al consultar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Guardar sesión
    req.session.usuario = results[0];
    res.json({ mensaje: 'Login exitoso', usuario: results[0] });
  });
});

router.get('/perfil', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  res.json({ usuario: req.session.usuario });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ mensaje: 'Sesión cerrada' });
  });
});

module.exports = router;
