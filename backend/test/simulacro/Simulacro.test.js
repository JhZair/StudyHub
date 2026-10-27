jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const Simulacro = require('../../src/simulacro/model/Simulacro');

const datosValidos = () => ({
  id_examen: 1,
  duracion: 90,
  preguntas: 30,
  puntaje: 85,
  fecha_realizacion: new Date('2023-03-01T00:00:00Z'),
  id_curso: 1,
  id_usuario: 1
});

describe('Simulacro', () => {
  test('crea un simulacro valido con todos sus campos', () => {
    // Arrange
    const datos = datosValidos();

    // Act
    const simulacro = new Simulacro(datos);

    // Assert
    expect(simulacro).toMatchObject(datosValidos());
  });

  test('asigna null a id_examen, puntaje y fecha_realizacion cuando no vienen', () => {
    // Arrange
    const { id_examen: _a, puntaje: _b, fecha_realizacion: _c, ...datos } = datosValidos();

    // Act
    const simulacro = new Simulacro(datos);

    // Assert
    expect(simulacro.id_examen).toBeNull();
    expect(simulacro.puntaje).toBeNull();
    expect(simulacro.fecha_realizacion).toBeNull();
  });

  test.each([
    ['minimo', 0],
    ['maximo', 100]
  ])('acepta el puntaje %s del rango', (_descripcion, puntaje) => {
    // Arrange
    const datos = { ...datosValidos(), puntaje };

    // Act
    const simulacro = new Simulacro(datos);

    // Assert
    expect(simulacro.puntaje).toBe(puntaje);
  });

  test.each([
    ['0', 0],
    ['negativo', -1],
    ['decimal', 1.5]
  ])('rechaza un id_examen %s', (_descripcion, id) => {
    // Arrange
    const datos = { ...datosValidos(), id_examen: id };

    // Act
    const crear = () => new Simulacro(datos);

    // Assert
    expect(crear).toThrow('id_examen debe ser un entero positivo');
  });

  test.each([
    ['0', 0],
    ['negativa', -30],
    ['decimal', 1.5],
    ['texto', '90'],
    ['ausente', undefined]
  ])('rechaza una duracion %s', (_descripcion, duracion) => {
    // Arrange
    const datos = { ...datosValidos(), duracion };

    // Act
    const crear = () => new Simulacro(datos);

    // Assert
    expect(crear).toThrow('duracion debe ser un entero positivo');
  });

  test.each([
    ['0', 0],
    ['negativo', -5],
    ['decimal', 2.5],
    ['ausente', undefined]
  ])('rechaza un numero de preguntas %s', (_descripcion, preguntas) => {
    // Arrange
    const datos = { ...datosValidos(), preguntas };

    // Act
    const crear = () => new Simulacro(datos);

    // Assert
    expect(crear).toThrow('preguntas debe ser un entero positivo');
  });

  test.each([
    ['negativo', -1],
    ['mayor a 100', 101],
    ['decimal', 85.5],
    ['texto', '85']
  ])('rechaza un puntaje %s', (_descripcion, puntaje) => {
    // Arrange
    const datos = { ...datosValidos(), puntaje };

    // Act
    const crear = () => new Simulacro(datos);

    // Assert
    expect(crear).toThrow('puntaje debe ser un entero entre 0 y 100');
  });

  test.each([
    ['fecha invalida', new Date('no-es-fecha')],
    ['texto en lugar de Date', '2023-03-01']
  ])('rechaza fecha_realizacion con %s', (_descripcion, fecha) => {
    // Arrange
    const datos = { ...datosValidos(), fecha_realizacion: fecha };

    // Act
    const crear = () => new Simulacro(datos);

    // Assert
    expect(crear).toThrow('fecha_realizacion debe ser una fecha valida');
  });

  test.each([
    ['0', 0],
    ['ausente', undefined]
  ])('rechaza un id_curso %s', (_descripcion, id) => {
    // Arrange
    const datos = { ...datosValidos(), id_curso: id };

    // Act
    const crear = () => new Simulacro(datos);

    // Assert
    expect(crear).toThrow('id_curso debe ser un entero positivo');
  });

  test.each([
    ['0', 0],
    ['ausente', undefined]
  ])('rechaza un id_usuario %s', (_descripcion, id) => {
    // Arrange
    const datos = { ...datosValidos(), id_usuario: id };

    // Act
    const crear = () => new Simulacro(datos);

    // Assert
    expect(crear).toThrow('id_usuario debe ser un entero positivo');
  });
});
