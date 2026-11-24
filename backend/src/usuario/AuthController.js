const express = require('express');

module.exports = function crearAuthRouter(usuarioService) {
  const router = express.Router();

  // Los errores de los handlers async llegan a manejadorErrores (Express 5 llama a next(err))

  // LOGIN
  router.post('/login', async (req, res) => {
    const usuario = await usuarioService.login(req.body);
    req.session.usuario = usuario;
    res.json({ mensaje: 'Login exitoso', usuario });
  });

  // REGISTRO
  router.post('/signup', async (req, res) => {
    res.locals.mensajesError = { INTERNO: 'Error al registrar usuario' };
    await usuarioService.registrar(req.body);
    res.json({ mensaje: 'Registro exitoso' });
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
