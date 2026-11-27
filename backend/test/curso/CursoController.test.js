const express = require('express');
const request = require('supertest');
const manejadorErrores = require('../../src/shared/manejadorErrores');
const crearCursoRouter = require('../../src/curso/CursoController');

const crearApp = (cursoService) => {
  const app = express();
  app.use(express.json());
  app.use('/api/cursos', crearCursoRouter(cursoService));
  app.use(manejadorErrores);
  return app;
};

describe('CursoController', () => {
  test('GET /api/cursos devuelve la lista de cursos', async () => {
    const servicio = { listar: jest.fn().mockResolvedValue([{ nombre: 'Calculo I' }]) };

    const res = await request(crearApp(servicio)).get('/api/cursos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ nombre: 'Calculo I' }]);
  });

  test('POST /api/cursos registra el curso y responde 201', async () => {
    const servicio = { registrar: jest.fn().mockResolvedValue({ id: 1, nombre: 'Fisica' }) };

    const res = await request(crearApp(servicio)).post('/api/cursos').send({ nombre: 'Fisica' });

    expect(res.status).toBe(201);
    expect(servicio.registrar).toHaveBeenCalledWith({ nombre: 'Fisica' });
  });

  test('un error del servicio llega al manejador de errores y responde 500', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const servicio = { listar: jest.fn().mockRejectedValue(new Error('fallo')) };

    const res = await request(crearApp(servicio)).get('/api/cursos');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error en el servidor' });
  });
});
