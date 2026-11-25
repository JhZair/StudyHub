const SimulacroRepository = require('../../src/simulacro/SimulacroRepository');
const Simulacro = require('../../src/simulacro/model/Simulacro');

describe('SimulacroRepository', () => {
  let db;
  let repository;

  beforeEach(() => {
    db = {
      query: jest.fn(),
    };
    repository = new SimulacroRepository(db);
  });

  const filaSimulacro1 = () => ({
    id_examen: 1,
    duracion: 60,
    preguntas: 20,
    puntaje: 80,
    id_curso: 1,
    id_usuario: 2,
  });

  const filaSimulacro2 = () => ({
    id_examen: 2,
    duracion: 90,
    preguntas: 30,
    puntaje: 100,
    id_curso: 2,
    id_usuario: 1,
  });

  test('findAll devuelve todas las filas como instancias de Simulacro', async () => {
    const filas = [filaSimulacro1(), filaSimulacro2()];
    db.query.mockResolvedValue([filas]);

    const simulacros = await repository.findAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM simulacros_examenes');
    expect(simulacros).toHaveLength(2);
    simulacros.forEach((simulacro) => expect(simulacro).toBeInstanceOf(Simulacro));
    expect(simulacros.map((s) => s.id_examen)).toEqual([1, 2]);
  });

  test('findById devuelve un Simulacro cuando el id existe', async () => {
    const filas = [filaSimulacro1()];
    db.query.mockResolvedValue([filas]);

    const simulacro = await repository.findById(1);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM simulacros_examenes WHERE id_examen = ?', [1]);
    expect(simulacro).toBeInstanceOf(Simulacro);
    expect(simulacro).toMatchObject(filaSimulacro1());
  });

  test('findById devuelve null cuando el id no existe', async () => {
    db.query.mockResolvedValue([[]]);

    const simulacro = await repository.findById(999);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM simulacros_examenes WHERE id_examen = ?', [999]);
    expect(simulacro).toBeNull();
  });

  test('save inserta el simulacro y lo devuelve con el id generado', async () => {
    const nuevoSimulacro = {
      duracion: 60,
      preguntas: 20,
      puntaje: 78,
      id_curso: 3,
      id_usuario: 3,
    };
    db.query.mockResolvedValue([{ insertId: 5 }]);

    const simulacroGuardado = await repository.save(nuevoSimulacro);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO simulacros_examenes (duracion, preguntas, puntaje, id_curso, id_usuario) VALUES (?, ?, ?, ?, ?)',
      [60, 20, 78, 3, 3]
    );
    expect(simulacroGuardado).toBeInstanceOf(Simulacro);
    expect(simulacroGuardado.id_examen).toBe(5);
  });
});