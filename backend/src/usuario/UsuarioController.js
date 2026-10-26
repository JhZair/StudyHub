const express = require('express');

module.exports = (usuarioService) => {
  const router = express.Router();

  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    try {
      res.json(await usuarioService.listar());
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // Registrar usuario
  router.post('/', async (req, res) => {
    try {
      const { id_usuario, nombre, email, universidad } = await usuarioService.registrar(req.body);
      res.status(201).json({ id: id_usuario, nombre, email, universidad });
    } catch (err) {
      if (err.codigo === 'EMAIL_DUPLICADO') {
        return res.status(400).json({ error: 'Ya existe una cuenta con ese correo electrónico' });
      }
      if (err.codigo === 'VALIDACION') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  });

  return router;
};
