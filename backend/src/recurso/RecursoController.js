const express = require('express');
const uploadConfig = require('./uploadConfig');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function crearRecursoRouter(recursoService) {
  const router = express.Router();

  router.get('/', asyncHandler(async (req, res) => {
    const recursos = await recursoService.obtenerTodos();
    res.json(recursos);
  }));

  router.post('/', uploadConfig.single('archivo'), asyncHandler(async (req, res) => {
    const nuevoRecurso = await recursoService.subirRecurso(req.body, req.file);
    res.status(201).json(nuevoRecurso);
  }));

  return router;
}

module.exports = crearRecursoRouter;