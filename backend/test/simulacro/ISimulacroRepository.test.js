jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const ISimulacroRepository = require('../../src/simulacro/model/ISimulacroRepository');

describe('ISimulacroRepository', () => {
  test.each([
    ['findAll', []],
    ['findById', [1]],
    ['save', [{}]]
  ])('%s lanza "No implementado"', async (metodo, argumentos) => {
    // Arrange
    const repositorio = new ISimulacroRepository();

    // Act
    const llamada = repositorio[metodo](...argumentos);

    // Assert
    await expect(llamada).rejects.toThrow('No implementado');
  });
});
