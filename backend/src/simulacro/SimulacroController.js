const express = require('express');

module.exports = (simulacroService) => {
  const router = express.Router();

  // Obtener todos los simulacros
  router.get('/', async (req, res) => {
    try {
      res.json(await simulacroService.listar());
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los simulacros' });
    }
  });

  // Agregar simulacro
  router.post('/', async (req, res) => {
    try {
      const { id_examen } = await simulacroService.registrar(req.body);
      res.status(201).json({ id: id_examen });
    } catch (err) {
      if (err.codigo === 'VALIDACION' || err.codigo === 'REFERENCIA_INVALIDA') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Error al registrar el simulacro' });
    }
  });

  return router;
};
