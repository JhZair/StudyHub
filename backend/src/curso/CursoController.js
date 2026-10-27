const express = require('express');

module.exports = (cursoService) => {
  const router = express.Router();

  // Obtener todos los cursos
  router.get('/', async (req, res) => {
    try {
      res.json(await cursoService.listar());
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los cursos' });
    }
  });

  // Agregar un curso
  router.post('/', async (req, res) => {
    try {
      const { id_curso, nombre, area } = await cursoService.registrar(req.body);
      res.status(201).json({ id: id_curso, nombre, area });
    } catch (err) {
      if (err.codigo === 'VALIDACION' || err.codigo === 'CURSO_DUPLICADO') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Error al registrar el curso' });
    }
  });

  return router;
};
