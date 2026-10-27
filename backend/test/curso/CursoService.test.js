jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const CursoService = require('../../src/curso/CursoService');
const ICursoRepository = require('../../src/curso/model/ICursoRepository');
const Curso = require('../../src/curso/model/Curso');

// Doble de ICursoRepository: cada metodo de la interfaz es un jest.fn()
const crearRepositorioMock = () => Object.assign(new ICursoRepository(), {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn()
});

describe('CursoService', () => {
  let repositorio;
  let servicio;

  beforeEach(() => {
    repositorio = crearRepositorioMock();
    servicio = new CursoService(repositorio);
  });

  describe('registrar', () => {
    test('guarda un curso valido y devuelve el curso con su id', async () => {
      // Arrange
      repositorio.save.mockImplementation(async (curso) => new Curso({ ...curso, id_curso: 7 }));

      // Act
      const resultado = await servicio.registrar({ nombre: 'Calculo 1', area: 'Ciencias Basicas' });

      // Assert
      expect(repositorio.save).toHaveBeenCalledTimes(1);
      expect(repositorio.save.mock.calls[0][0]).toBeInstanceOf(Curso);
      expect(repositorio.save.mock.calls[0][0]).toMatchObject({ id_curso: null, nombre: 'Calculo 1', area: 'Ciencias Basicas' });
      expect(resultado).toMatchObject({ id_curso: 7, nombre: 'Calculo 1', area: 'Ciencias Basicas' });
    });

    test('guarda el curso con area null cuando no se envia area', async () => {
      // Arrange
      repositorio.save.mockImplementation(async (curso) => new Curso({ ...curso, id_curso: 8 }));

      // Act
      await servicio.registrar({ nombre: 'Calculo 1' });

      // Assert
      expect(repositorio.save.mock.calls[0][0].area).toBeNull();
    });

    test('rechaza un curso sin nombre con codigo VALIDACION y no guarda', async () => {
      // Arrange
      const datos = { area: 'Ciencias Basicas' };

      // Act
      const registro = servicio.registrar(datos);

      // Assert
      await expect(registro).rejects.toMatchObject({ codigo: 'VALIDACION', message: 'El nombre es obligatorio' });
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('rechaza un nombre de mas de 100 caracteres con codigo VALIDACION y no guarda', async () => {
      // Arrange
      const datos = { nombre: 'a'.repeat(101), area: 'Ciencias Basicas' };

      // Act
      const registro = servicio.registrar(datos);

      // Assert
      await expect(registro).rejects.toMatchObject({ codigo: 'VALIDACION' });
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('propaga el error CURSO_DUPLICADO que reporta el repositorio', async () => {
      // Arrange
      const duplicado = Object.assign(new Error('Ya existe un curso con ese nombre'), { codigo: 'CURSO_DUPLICADO' });
      repositorio.save.mockRejectedValue(duplicado);

      // Act
      const registro = servicio.registrar({ nombre: 'Calculo 1' });

      // Assert
      await expect(registro).rejects.toBe(duplicado);
    });
  });

  describe('listar', () => {
    test('devuelve los cursos que entrega el repositorio', async () => {
      // Arrange
      const cursos = [new Curso({ id_curso: 1, nombre: 'Matemáticas I' }), new Curso({ id_curso: 2, nombre: 'Física General' })];
      repositorio.findAll.mockResolvedValue(cursos);

      // Act
      const resultado = await servicio.listar();

      // Assert
      expect(repositorio.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(cursos);
    });

    test('devuelve una lista vacia cuando no hay cursos', async () => {
      // Arrange
      repositorio.findAll.mockResolvedValue([]);

      // Act
      const resultado = await servicio.listar();

      // Assert
      expect(resultado).toEqual([]);
    });
  });
});
