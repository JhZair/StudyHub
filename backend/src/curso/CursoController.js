const express = require('express');
const manejadorErrores = require('../shared/manejadorErrores');

function crearCursoRouter(cursoService) {
  const router = express.Router();

  // GET /api/cursos - Obtener todos los cursos
  router.get('/', manejadorErrores(async (req, res) => {
    const cursos = await cursoService.listar();
    res.json(cursos);
  }));

  // POST /api/cursos - Registrar un nuevo curso
  router.post('/', manejadorErrores(async (req, res) => {
    const nuevoCurso = await cursoService.registrar(req.body);
    res.status(201).json(nuevoCurso);
  }));

  return router;
}

module.exports = crearCursoRouter;