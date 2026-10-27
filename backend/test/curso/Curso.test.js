jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const Curso = require('../../src/curso/model/Curso');

const datosValidos = () => ({
  id_curso: 1,
  nombre: 'Matemáticas I',
  area: 'Ciencias Básicas'
});

describe('Curso', () => {
  test('crea un curso valido con todos sus campos', () => {
    // Arrange
    const datos = { ...datosValidos(), nombre: '  Matemáticas I  ', area: '  Ciencias Básicas  ' };

    // Act
    const curso = new Curso(datos);

    // Assert
    expect(curso).toMatchObject(datosValidos());
  });

  test('asigna null a id_curso y area cuando no vienen', () => {
    // Arrange
    const datos = { nombre: 'Calculo 1' };

    // Act
    const curso = new Curso(datos);

    // Assert
    expect(curso.id_curso).toBeNull();
    expect(curso.area).toBeNull();
  });

  test('acepta un nombre de exactamente 100 caracteres', () => {
    // Arrange
    const datos = { ...datosValidos(), nombre: 'a'.repeat(100) };

    // Act
    const curso = new Curso(datos);

    // Assert
    expect(curso.nombre).toHaveLength(100);
  });

  test.each([
    ['0', 0],
    ['negativo', -3],
    ['decimal', 1.5],
    ['texto', '3']
  ])('rechaza un id_curso %s', (_descripcion, id) => {
    // Arrange
    const datos = { ...datosValidos(), id_curso: id };

    // Act
    const crear = () => new Curso(datos);

    // Assert
    expect(crear).toThrow('id_curso debe ser un entero positivo');
  });

  test.each([
    ['vacio tras trim', '   '],
    ['ausente', undefined],
    ['no es texto', 123]
  ])('rechaza un nombre %s', (_descripcion, nombre) => {
    // Arrange
    const datos = { ...datosValidos(), nombre };

    // Act
    const crear = () => new Curso(datos);

    // Assert
    expect(crear).toThrow('El nombre es obligatorio');
  });

  test('rechaza un nombre de mas de 100 caracteres', () => {
    // Arrange
    const datos = { ...datosValidos(), nombre: 'a'.repeat(101) };

    // Act
    const crear = () => new Curso(datos);

    // Assert
    expect(crear).toThrow('El nombre no puede superar 100 caracteres');
  });

  test.each([
    ['vacia tras trim', '   '],
    ['no es texto', 42]
  ])('rechaza un area %s', (_descripcion, area) => {
    // Arrange
    const datos = { ...datosValidos(), area };

    // Act
    const crear = () => new Curso(datos);

    // Assert
    expect(crear).toThrow('El area no puede estar vacia');
  });

  test('rechaza un area de mas de 100 caracteres', () => {
    // Arrange
    const datos = { ...datosValidos(), area: 'a'.repeat(101) };

    // Act
    const crear = () => new Curso(datos);

    // Assert
    expect(crear).toThrow('El area no puede superar 100 caracteres');
  });
});
