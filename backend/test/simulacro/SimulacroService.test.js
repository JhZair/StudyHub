jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const SimulacroService = require('../../src/simulacro/SimulacroService');
const ISimulacroRepository = require('../../src/simulacro/model/ISimulacroRepository');
const Simulacro = require('../../src/simulacro/model/Simulacro');

// Doble de ISimulacroRepository: cada metodo de la interfaz es un jest.fn()
const crearRepositorioMock = () => Object.assign(new ISimulacroRepository(), {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn()
});

const datosRegistro = () => ({ duracion: 90, preguntas: 30, puntaje: 85, id_curso: 1, id_usuario: 1 });

describe('SimulacroService', () => {
  let repositorio;
  let servicio;

  beforeEach(() => {
    repositorio = crearRepositorioMock();
    servicio = new SimulacroService(repositorio);
  });

  describe('registrar', () => {
    test('guarda un simulacro valido y devuelve el simulacro con su id', async () => {
      // Arrange
      repositorio.save.mockImplementation(async (simulacro) => new Simulacro({ ...simulacro, id_examen: 4 }));

      // Act
      const resultado = await servicio.registrar(datosRegistro());

      // Assert
      expect(repositorio.save).toHaveBeenCalledTimes(1);
      expect(repositorio.save.mock.calls[0][0]).toBeInstanceOf(Simulacro);
      expect(repositorio.save.mock.calls[0][0]).toMatchObject({ id_examen: null, ...datosRegistro() });
      expect(resultado).toMatchObject({ id_examen: 4, ...datosRegistro() });
    });

    test('guarda el simulacro con puntaje null cuando no se envia puntaje', async () => {
      // Arrange
      const { puntaje: _omitido, ...datos } = datosRegistro();
      repositorio.save.mockImplementation(async (simulacro) => new Simulacro({ ...simulacro, id_examen: 5 }));

      // Act
      await servicio.registrar(datos);

      // Assert
      expect(repositorio.save.mock.calls[0][0].puntaje).toBeNull();
    });

    test('rechaza una duracion no positiva con codigo VALIDACION y no guarda', async () => {
      // Arrange
      const datos = { ...datosRegistro(), duracion: 0 };

      // Act
      const registro = servicio.registrar(datos);

      // Assert
      await expect(registro).rejects.toMatchObject({ codigo: 'VALIDACION', message: 'duracion debe ser un entero positivo' });
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('rechaza un puntaje fuera de rango con codigo VALIDACION y no guarda', async () => {
      // Arrange
      const datos = { ...datosRegistro(), puntaje: 150 };

      // Act
      const registro = servicio.registrar(datos);

      // Assert
      await expect(registro).rejects.toMatchObject({ codigo: 'VALIDACION' });
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('rechaza un simulacro sin id_curso con codigo VALIDACION y no guarda', async () => {
      // Arrange
      const { id_curso: _omitido, ...datos } = datosRegistro();

      // Act
      const registro = servicio.registrar(datos);

      // Assert
      await expect(registro).rejects.toMatchObject({ codigo: 'VALIDACION', message: 'id_curso debe ser un entero positivo' });
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('propaga el error REFERENCIA_INVALIDA que reporta el repositorio', async () => {
      // Arrange
      const referencia = Object.assign(new Error('El curso o el usuario no existe'), { codigo: 'REFERENCIA_INVALIDA' });
      repositorio.save.mockRejectedValue(referencia);

      // Act
      const registro = servicio.registrar({ ...datosRegistro(), id_curso: 999 });

      // Assert
      await expect(registro).rejects.toBe(referencia);
    });
  });

  describe('listar', () => {
    test('devuelve los simulacros que entrega el repositorio', async () => {
      // Arrange
      const simulacros = [
        new Simulacro({ id_examen: 1, ...datosRegistro() }),
        new Simulacro({ id_examen: 2, ...datosRegistro(), id_usuario: 2 })
      ];
      repositorio.findAll.mockResolvedValue(simulacros);

      // Act
      const resultado = await servicio.listar();

      // Assert
      expect(repositorio.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(simulacros);
    });

    test('devuelve una lista vacia cuando no hay simulacros', async () => {
      // Arrange
      repositorio.findAll.mockResolvedValue([]);

      // Act
      const resultado = await servicio.listar();

      // Assert
      expect(resultado).toEqual([]);
    });
  });
});
