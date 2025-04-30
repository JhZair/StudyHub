const express = require('express');
const router = express.Router();

// Login simple
router.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  // Simular login (reemplazá con query real a MySQL si querés)
  if (usuario === 'admin' && password === '1234') {
    req.session.usuario = usuario;
    res.send({ mensaje: 'Login exitoso' });
  } else {
    res.status(401).send({ error: 'Credenciales inválidas' });
  }
});

// Ruta protegida
router.get('/perfil', (req, res) => {
  if (req.session.usuario) {
    res.send({ usuario: req.session.usuario });
  } else {
    res.status(401).send({ error: 'No estás logueado' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send({ mensaje: 'Sesión cerrada' });
  });
});

module.exports = router;
