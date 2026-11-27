const express = require('express');

function crearCursoRouter(cursoService) {
  const router = express.Router();

  async function listarCursos(req, res) {
    const cursos = await cursoService.listar();
    res.json(cursos);
  }

  async function registrarCurso(req, res) {
    const nuevoCurso = await cursoService.registrar(req.body);
    res.status(201).json(nuevoCurso);
  }

  // GET /api/cursos - Obtener todos los cursos
  router.get('/', listarCursos);

  // POST /api/cursos - Registrar un nuevo curso
  router.post('/', registrarCurso);

  return router;
}

module.exports = crearCursoRouter;
