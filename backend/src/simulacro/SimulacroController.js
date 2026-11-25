const express = require('express');
const manejadorErrores = require('../shared/manejadorErrores');

function crearSimulacroRouter(simulacroService) {
  const router = express.Router();

  // GET /api/simulacros - Obtener todos los simulacros
  router.get('/', manejadorErrores(async (req, res) => {
    const simulacros = await simulacroService.listar();
    res.json(simulacros);
  }));

  // POST /api/simulacros - Agregar simulacro
  router.post('/', manejadorErrores(async (req, res) => {
    const { id_examen } = await simulacroService.registrar(req.body);
    res.status(201).json({ id: id_examen });
  }));

  // POST /api/simulacros/puntajes/guardar - Guardar puntaje de simulacro/examen (Fix #41)
  router.post('/puntajes/guardar', manejadorErrores(async (req, res) => {
    const resultado = await simulacroService.guardarPuntaje(req.body);
    res.status(201).json(resultado);
  }));

  // GET /api/simulacros/puntajes/usuario/:id - Obtener puntajes por usuario (Fix #41)
  router.get('/puntajes/usuario/:id', manejadorErrores(async (req, res) => {
    const puntajes = await simulacroService.obtenerPuntajesPorUsuario(req.params.id);
    res.json(puntajes);
  }));

  return router;
}

module.exports = crearSimulacroRouter;