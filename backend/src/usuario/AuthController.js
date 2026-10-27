const express = require('express');

module.exports = (usuarioService) => {
  const router = express.Router();

  // LOGIN
  router.post('/login', async (req, res) => {
    try {
      const usuario = await usuarioService.login(req.body);
      req.session.usuario = usuario;
      res.json({ mensaje: 'Login exitoso', usuario });
    } catch (err) {
      if (err.codigo === 'VALIDACION') {
        return res.status(400).json({ error: err.message });
      }
      if (err.codigo === 'CREDENCIALES_INVALIDAS') {
        return res.status(401).json({ error: err.message });
      }
      console.error('Error al consultar:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

  // REGISTRO
  router.post('/signup', async (req, res) => {
    try {
      await usuarioService.registrar(req.body);
      res.json({ mensaje: 'Registro exitoso' });
    } catch (err) {
      if (err.codigo === 'VALIDACION' || err.codigo === 'EMAIL_DUPLICADO') {
        return res.status(400).json({ error: err.message });
      }
      console.error('Error al registrar:', err);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  });

  // PERFIL
  router.get('/perfil', (req, res) => {
    if (!req.session.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    res.json({ usuario: req.session.usuario });
  });

  // LOGOUT
  router.post('/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ mensaje: 'Sesión cerrada' });
    });
  });

  return router;
};
