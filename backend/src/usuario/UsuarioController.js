const express = require('express');

module.exports = function crearUsuarioRouter(usuarioService) {
  const router = express.Router();

  // Los errores de los handlers async llegan a manejadorErrores (Express 5 llama a next(err))

  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    res.json(await usuarioService.listar());
  });

  // Registrar usuario
  router.post('/', async (req, res) => {
    res.locals.mensajesError = {
      EMAIL_DUPLICADO: 'Ya existe una cuenta con ese correo electrónico',
      INTERNO: 'Error al registrar usuario'
    };
    const { id_usuario, nombre, email, universidad } = await usuarioService.registrar(req.body);
    res.status(201).json({ id: id_usuario, nombre, email, universidad });
  });

  return router;
};
