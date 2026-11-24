jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const crearAuthRouter = require('../../src/usuario/AuthController');
const crearUsuarioRouter = require('../../src/usuario/UsuarioController');

describe('Fabricas de rutas del modulo usuario', () => {
  test.each([
    ['crearAuthRouter', crearAuthRouter, ['/login', '/signup', '/perfil', '/logout']],
    ['crearUsuarioRouter', crearUsuarioRouter, ['/']]
  ])('%s es una funcion con nombre que devuelve un router de Express', (nombre, fabrica, rutasEsperadas) => {
    // Arrange
    const usuarioService = {};

    // Act
    const router = fabrica(usuarioService);
    const rutas = router.stack.map((capa) => capa.route.path);

    // Assert
    expect(fabrica.name).toBe(nombre);
    expect(new Set(rutas)).toEqual(new Set(rutasEsperadas));
  });
});
