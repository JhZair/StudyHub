const express = require('express');

function crearSimulacroRouter(simulacroService) {
  const router = express.Router();

  async function listarSimulacros(req, res) {
    const simulacros = await simulacroService.listar();
    res.json(simulacros);
  }

  async function registrarSimulacro(req, res) {
    const { id_examen } = await simulacroService.registrar(req.body);
    res.status(201).json({ id: id_examen });
  }

  async function guardarPuntaje(req, res) {
    const resultado = await simulacroService.guardarPuntaje(req.body);
    res.status(201).json(resultado);
  }

  async function obtenerPuntajesPorUsuario(req, res) {
    const puntajes = await simulacroService.obtenerPuntajesPorUsuario(req.params.id);
    res.json(puntajes);
  }

  // GET /api/simulacros - Obtener todos los simulacros
  router.get('/', listarSimulacros);

  // POST /api/simulacros - Agregar simulacro
  router.post('/', registrarSimulacro);

  // POST /api/simulacros/puntajes/guardar - Guardar puntaje de simulacro/examen (Fix #41)
  router.post('/puntajes/guardar', guardarPuntaje);

  // GET /api/simulacros/puntajes/usuario/:id - Obtener puntajes por usuario (Fix #41)
  router.get('/puntajes/usuario/:id', obtenerPuntajesPorUsuario);

  return router;
}

module.exports = crearSimulacroRouter;
