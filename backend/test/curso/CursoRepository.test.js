jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const db = require('../../src/config/database');
const CursoRepository = require('../../src/curso/CursoRepository');
const Curso = require('../../src/curso/model/Curso');

const filaMatematicas = () => ({ id_curso: 1, nombre: 'Matemáticas I', area: 'Ciencias Básicas' });
const filaFisica = () => ({ id_curso: 2, nombre: 'Física General', area: 'Ciencias Básicas' });

describe('CursoRepository', () => {
  let repositorio;

  beforeEach(() => {
    db.query.mockReset();
    repositorio = new CursoRepository(db);
  });

  test('findAll devuelve todas las filas como instancias de Curso', async () => {
    // Arrange
    db.query.mockResolvedValue([[filaMatematicas(), filaFisica()], []]);

    // Act
    const cursos = await repositorio.findAll();

    // Assert
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM curso');
    expect(cursos).toHaveLength(2);
    cursos.forEach((curso) => expect(curso).toBeInstanceOf(Curso));
    expect(cursos.map((c) => c.nombre)).toEqual(['Matemáticas I', 'Física General']);
  });

  test('findAll devuelve una lista vacia cuando no hay cursos', async () => {
    // Arrange
    db.query.mockResolvedValue([[], []]);

    // Act
    const cursos = await repositorio.findAll();

    // Assert
    expect(cursos).toEqual([]);
  });

  test('findById devuelve un Curso cuando el id existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[filaMatematicas()], []]);

    // Act
    const curso = await repositorio.findById(1);

    // Assert
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM curso WHERE id_curso = ?', [1]);
    expect(curso).toBeInstanceOf(Curso);
    expect(curso).toMatchObject(filaMatematicas());
  });

  test('findById devuelve null cuando el id no existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[], []]);

    // Act
    const curso = await repositorio.findById(999);

    // Assert
    expect(curso).toBeNull();
  });

  test('save inserta el curso y lo devuelve con el id generado', async () => {
    // Arrange
    const curso = new Curso({ nombre: 'Calculo 1', area: 'Ciencias Basicas' });
    db.query.mockResolvedValue([{ insertId: 7 }, undefined]);

    // Act
    const guardado = await repositorio.save(curso);

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO curso (nombre, area) VALUES (?, ?)',
      ['Calculo 1', 'Ciencias Basicas']
    );
    expect(guardado).toBeInstanceOf(Curso);
    expect(guardado).toMatchObject({ id_curso: 7, nombre: 'Calculo 1', area: 'Ciencias Basicas' });
  });

  test('save traduce ER_DUP_ENTRY de MySQL a un error de negocio CURSO_DUPLICADO', async () => {
    // Arrange
    const errorMysql = Object.assign(new Error("Duplicate entry 'Calculo 1' for key 'nombre'"), { code: 'ER_DUP_ENTRY' });
    db.query.mockRejectedValue(errorMysql);

    // Act
    const guardar = repositorio.save(new Curso({ nombre: 'Calculo 1' }));

    // Assert
    await expect(guardar).rejects.toMatchObject({ codigo: 'CURSO_DUPLICADO', message: 'Ya existe un curso con ese nombre' });
  });

  test('save propaga sin traducir un error de MySQL distinto de ER_DUP_ENTRY', async () => {
    // Arrange
    const errorMysql = Object.assign(new Error('Connection lost'), { code: 'PROTOCOL_CONNECTION_LOST' });
    db.query.mockRejectedValue(errorMysql);

    // Act
    const guardar = repositorio.save(new Curso({ nombre: 'Calculo 1' }));

    // Assert
    await expect(guardar).rejects.toBe(errorMysql);
    await expect(guardar).rejects.not.toHaveProperty('codigo');
  });
});
