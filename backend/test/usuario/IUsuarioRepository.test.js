jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const IUsuarioRepository = require('../../src/usuario/model/IUsuarioRepository');

describe('IUsuarioRepository', () => {
  test.each([
    ['findByEmail', ['ana.garcia@example.com']],
    ['findById', [1]],
    ['findAll', []],
    ['save', [{}]]
  ])('%s lanza "No implementado"', async (metodo, argumentos) => {
    // Arrange
    const repositorio = new IUsuarioRepository();

    // Act
    const llamada = repositorio[metodo](...argumentos);

    // Assert
    await expect(llamada).rejects.toThrow('No implementado');
  });
});
