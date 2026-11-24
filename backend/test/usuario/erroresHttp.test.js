jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const express = require('express');
const crearAuthRouter = require('../../src/usuario/AuthController');
const crearUsuarioRouter = require('../../src/usuario/UsuarioController');
const manejadorErrores = require('../../src/shared/manejadorErrores');

const errorDeNegocio = (codigo, mensaje) => Object.assign(new Error(mensaje), { codigo });

// Respuestas HTTP de las rutas de usuario cuando el servicio falla.
// Monta las rutas reales con el middleware de errores, como index.js.
describe('Errores HTTP de las rutas de usuario', () => {
  let servidor;
  let base;
  let usuarioService;
  let consoleError;

  beforeAll(async () => {
    usuarioService = { login: jest.fn(), registrar: jest.fn(), listar: jest.fn() };
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = {};
      next();
    });
    app.use('/api/auth', crearAuthRouter(usuarioService));
    app.use('/api/usuarios', crearUsuarioRouter(usuarioService));
    app.use(manejadorErrores);
    await new Promise((resolve) => {
      servidor = app.listen(0, resolve);
    });
    base = `http://localhost:${servidor.address().port}/api`;
  });

  afterAll(async () => {
    await new Promise((resolve) => servidor.close(resolve));
  });

  beforeEach(() => {
    jest.resetAllMocks();
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  const pedir = async (metodo, ruta, cuerpo) => {
    const respuesta = await fetch(base + ruta, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo && JSON.stringify(cuerpo)
    });
    return { status: respuesta.status, cuerpo: await respuesta.json() };
  };

  test.each([
    ['login', 'POST', '/auth/login', errorDeNegocio('VALIDACION', 'Faltan campos'), 400, 'Faltan campos'],
    ['login', 'POST', '/auth/login', errorDeNegocio('CREDENCIALES_INVALIDAS', 'Credenciales inválidas'), 401, 'Credenciales inválidas'],
    ['login', 'POST', '/auth/login', new Error('caida de la base'), 500, 'Error en el servidor'],
    ['registrar', 'POST', '/auth/signup', errorDeNegocio('VALIDACION', 'Faltan campos'), 400, 'Faltan campos'],
    ['registrar', 'POST', '/auth/signup', errorDeNegocio('EMAIL_DUPLICADO', 'Correo ya registrado'), 400, 'Correo ya registrado'],
    ['registrar', 'POST', '/auth/signup', new Error('caida de la base'), 500, 'Error al registrar usuario'],
    ['registrar', 'POST', '/usuarios', errorDeNegocio('VALIDACION', 'Faltan campos'), 400, 'Faltan campos'],
    ['registrar', 'POST', '/usuarios', errorDeNegocio('EMAIL_DUPLICADO', 'Correo ya registrado'), 400, 'Ya existe una cuenta con ese correo electrónico'],
    ['registrar', 'POST', '/usuarios', new Error('caida de la base'), 500, 'Error al registrar usuario'],
    ['listar', 'GET', '/usuarios', new Error('caida de la base'), 500, 'Error en el servidor']
  ])('%s: %s %s con %p responde %i', async (metodoServicio, metodo, ruta, error, status, mensaje) => {
    // Arrange
    usuarioService[metodoServicio].mockRejectedValue(error);

    // Act
    const respuesta = await pedir(metodo, ruta, metodo === 'POST' ? {} : undefined);

    // Assert
    expect(respuesta).toEqual({ status, cuerpo: { error: mensaje } });
  });

  test('las rutas siguen respondiendo igual cuando el servicio tiene exito', async () => {
    // Arrange
    const usuario = { id_usuario: 7, nombre: 'Leo', email: 'leo@example.com', universidad: 'ucsp' };
    usuarioService.login.mockResolvedValue(usuario);
    usuarioService.registrar.mockResolvedValue(usuario);

    // Act
    const login = await pedir('POST', '/auth/login', {});
    const signup = await pedir('POST', '/auth/signup', {});
    const alta = await pedir('POST', '/usuarios', {});

    // Assert
    expect(login).toEqual({ status: 200, cuerpo: { mensaje: 'Login exitoso', usuario } });
    expect(signup).toEqual({ status: 200, cuerpo: { mensaje: 'Registro exitoso' } });
    expect(alta).toEqual({ status: 201, cuerpo: { id: 7, nombre: 'Leo', email: 'leo@example.com', universidad: 'ucsp' } });
  });
});
