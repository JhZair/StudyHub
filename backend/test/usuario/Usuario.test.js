jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const Usuario = require('../../src/usuario/model/Usuario');

const datosValidos = () => ({
  id_usuario: 1,
  nombre: 'Ana García',
  email: 'ana.garcia@example.com',
  password: 'secreta123',
  universidad: 'Universidad Nacional',
  fecha_registro: new Date('2023-01-15T00:00:00Z'),
  ultimo_acceso: new Date('2023-06-20T00:00:00Z')
});

describe('Usuario', () => {
  test('crea un usuario valido con todos sus campos', () => {
    // Arrange
    const datos = { ...datosValidos(), nombre: '  Ana García  ' };

    // Act
    const usuario = new Usuario(datos);

    // Assert
    expect(usuario).toMatchObject({ ...datosValidos(), nombre: 'Ana García' });
  });

  test('rechaza un id_usuario que no es entero positivo', () => {
    // Arrange
    const datos = { ...datosValidos(), id_usuario: 0 };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('id_usuario debe ser un entero positivo');
  });

  test('rechaza un nombre vacio tras trim', () => {
    // Arrange
    const datos = { ...datosValidos(), nombre: '   ' };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('El nombre es obligatorio');
  });

  test('rechaza un nombre de mas de 100 caracteres', () => {
    // Arrange
    const datos = { ...datosValidos(), nombre: 'a'.repeat(101) };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('El nombre no puede superar 100 caracteres');
  });

  test('rechaza un email vacio', () => {
    // Arrange
    const datos = { ...datosValidos(), email: '' };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('El email es obligatorio');
  });

  test('rechaza un email con formato invalido', () => {
    // Arrange
    const datos = { ...datosValidos(), email: 'ana.example.com' };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('El email no tiene un formato valido');
  });

  test('rechaza un email de mas de 100 caracteres', () => {
    // Arrange
    const datos = { ...datosValidos(), email: `${'a'.repeat(90)}@example.com` };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('El email no puede superar 100 caracteres');
  });

  test('rechaza una password vacia', () => {
    // Arrange
    const datos = { ...datosValidos(), password: '' };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('La password es obligatoria');
  });

  test('rechaza una password de mas de 100 caracteres', () => {
    // Arrange
    const datos = { ...datosValidos(), password: 'x'.repeat(101) };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('La password no puede superar 100 caracteres');
  });

  test('rechaza una universidad vacia cuando viene', () => {
    // Arrange
    const datos = { ...datosValidos(), universidad: '   ' };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('La universidad no puede estar vacia');
  });

  test('rechaza una universidad de mas de 100 caracteres', () => {
    // Arrange
    const datos = { ...datosValidos(), universidad: 'u'.repeat(101) };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('La universidad no puede superar 100 caracteres');
  });

  test('rechaza una fecha_registro invalida', () => {
    // Arrange
    const datos = { ...datosValidos(), fecha_registro: new Date('no-es-fecha') };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('fecha_registro debe ser una fecha valida');
  });

  test('rechaza un ultimo_acceso invalido', () => {
    // Arrange
    const datos = { ...datosValidos(), ultimo_acceso: '2023-06-20' };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('ultimo_acceso debe ser una fecha valida');
  });

  test('rechaza un ultimo_acceso anterior a fecha_registro', () => {
    // Arrange
    const datos = {
      ...datosValidos(),
      fecha_registro: new Date('2023-06-20T00:00:00Z'),
      ultimo_acceso: new Date('2023-01-15T00:00:00Z')
    };

    // Act
    const crear = () => new Usuario(datos);

    // Assert
    expect(crear).toThrow('ultimo_acceso no puede ser anterior a fecha_registro');
  });
});
