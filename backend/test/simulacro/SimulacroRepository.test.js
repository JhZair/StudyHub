jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const db = require('../../src/config/database');
const SimulacroRepository = require('../../src/simulacro/SimulacroRepository');
const Simulacro = require('../../src/simulacro/model/Simulacro');

const filaSimulacro1 = () => ({
  id_examen: 1,
  duracion: 90,
  preguntas: 30,
  puntaje: 85,
  fecha_realizacion: new Date('2023-03-01T00:00:00Z'),
  id_curso: 1,
  id_usuario: 1
});
const filaSimulacro2 = () => ({ ...filaSimulacro1(), id_examen: 2, duracion: 120, preguntas: 40, puntaje: 92, id_curso: 2, id_usuario: 2 });

const nuevoSimulacro = () => new Simulacro({ duracion: 60, preguntas: 20, puntaje: 78, id_curso: 3, id_usuario: 3 });

describe('SimulacroRepository', () => {
  let repositorio;

  beforeEach(() => {
    db.query.mockReset();
    repositorio = new SimulacroRepository(db);
  });

  test('findAll devuelve todas las filas como instancias de Simulacro', async () => {
    // Arrange
    db.query.mockResolvedValue([[filaSimulacro1(), filaSimulacro2()], []]);

    // Act
    const simulacros = await repositorio.findAll();

    // Assert
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM simulacros_examenes');
    expect(simulacros).toHaveLength(2);
    simulacros.forEach((simulacro) => expect(simulacro).toBeInstanceOf(Simulacro));
    expect(simulacros.map((s) => s.id_examen)).toEqual([1, 2]);
  });

  test('findAll devuelve una lista vacia cuando no hay simulacros', async () => {
    // Arrange
    db.query.mockResolvedValue([[], []]);

    // Act
    const simulacros = await repositorio.findAll();

    // Assert
    expect(simulacros).toEqual([]);
  });

  test('findById devuelve un Simulacro cuando el id existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[filaSimulacro1()], []]);

    // Act
    const simulacro = await repositorio.findById(1);

    // Assert
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM simulacros_examenes WHERE id_examen = ?', [1]);
    expect(simulacro).toBeInstanceOf(Simulacro);
    expect(simulacro).toMatchObject(filaSimulacro1());
  });

  test('findById devuelve null cuando el id no existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[], []]);

    // Act
    const simulacro = await repositorio.findById(999);

    // Assert
    expect(simulacro).toBeNull();
  });

  test('save inserta el simulacro y lo devuelve con el id generado', async () => {
    // Arrange
    const simulacro = nuevoSimulacro();
    db.query.mockResolvedValue([{ insertId: 4 }, undefined]);

    // Act
    const guardado = await repositorio.save(simulacro);

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO simulacros_examenes (duracion, preguntas, puntaje, id_curso, id_usuario) VALUES (?, ?, ?, ?, ?)',
      [60, 20, 78, 3, 3]
    );
    expect(guardado).toBeInstanceOf(Simulacro);
    expect(guardado).toMatchObject({ ...simulacro, id_examen: 4 });
  });

  test('save traduce ER_NO_REFERENCED_ROW_2 de MySQL a un error de negocio REFERENCIA_INVALIDA', async () => {
    // Arrange
    const errorMysql = Object.assign(new Error('Cannot add or update a child row: a foreign key constraint fails'), { code: 'ER_NO_REFERENCED_ROW_2' });
    db.query.mockRejectedValue(errorMysql);

    // Act
    const guardar = repositorio.save(nuevoSimulacro());

    // Assert
    await expect(guardar).rejects.toMatchObject({ codigo: 'REFERENCIA_INVALIDA', message: 'El curso o el usuario no existe' });
  });

  test('save propaga sin traducir un error de MySQL distinto de ER_NO_REFERENCED_ROW_2', async () => {
    // Arrange
    const errorMysql = Object.assign(new Error('Connection lost'), { code: 'PROTOCOL_CONNECTION_LOST' });
    db.query.mockRejectedValue(errorMysql);

    // Act
    const guardar = repositorio.save(nuevoSimulacro());

    // Assert
    await expect(guardar).rejects.toBe(errorMysql);
    await expect(guardar).rejects.not.toHaveProperty('codigo');
  });
});
