jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const ICursoRepository = require('../../src/curso/model/ICursoRepository');

describe('ICursoRepository', () => {
  test.each([
    ['findAll', []],
    ['findById', [1]],
    ['save', [{}]]
  ])('%s lanza "No implementado"', async (metodo, argumentos) => {
    // Arrange
    const repositorio = new ICursoRepository();

    // Act
    const llamada = repositorio[metodo](...argumentos);

    // Assert
    await expect(llamada).rejects.toThrow('No implementado');
  });
});
