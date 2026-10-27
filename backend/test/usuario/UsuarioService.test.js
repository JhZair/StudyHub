jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const bcrypt = require('bcryptjs');
const UsuarioService = require('../../src/usuario/UsuarioService');
const IUsuarioRepository = require('../../src/usuario/model/IUsuarioRepository');
const Usuario = require('../../src/usuario/model/Usuario');

// Doble de IUsuarioRepository: cada metodo de la interfaz es un jest.fn()
const crearRepositorioMock = () => Object.assign(new IUsuarioRepository(), {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn()
});

const datosRegistro = () => ({
  nombre: 'Leo Ramos',
  email: 'leo@example.com',
  password: 'secreta123',
  universidad: 'UCSP'
});

describe('UsuarioService', () => {
  let repositorio;
  let servicio;
  let hashSecreta;

  beforeAll(async () => {
    hashSecreta = await bcrypt.hash('secreta123', 10);
  });

  beforeEach(() => {
    repositorio = crearRepositorioMock();
    servicio = new UsuarioService(repositorio);
  });

  const usuarioGuardado = () => new Usuario({
    id_usuario: 1,
    ...datosRegistro(),
    password: hashSecreta,
    fecha_registro: new Date('2026-10-26T10:00:00Z'),
    ultimo_acceso: new Date('2026-10-26T10:00:00Z')
  });

  describe('registrar', () => {
    test('rechaza un email ya registrado con codigo EMAIL_DUPLICADO', async () => {
      // Arrange
      repositorio.findByEmail.mockResolvedValue(usuarioGuardado());

      // Act
      const registro = servicio.registrar(datosRegistro());

      // Assert
      await expect(registro).rejects.toMatchObject({ codigo: 'EMAIL_DUPLICADO' });
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('rechaza un registro sin universidad con codigo VALIDACION', async () => {
      // Arrange
      const datos = { ...datosRegistro(), universidad: undefined };

      // Act
      const registro = servicio.registrar(datos);

      // Assert
      await expect(registro).rejects.toMatchObject({ codigo: 'VALIDACION', message: 'Faltan campos' });
      expect(repositorio.findByEmail).not.toHaveBeenCalled();
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('rechaza una password de 7 caracteres con codigo VALIDACION', async () => {
      // Arrange
      const datos = { ...datosRegistro(), password: 'abc1234' };

      // Act
      const registro = servicio.registrar(datos);

      // Assert
      await expect(registro).rejects.toMatchObject({
        codigo: 'VALIDACION',
        message: 'La password debe tener al menos 8 caracteres'
      });
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    test('guarda la password hasheada con bcrypt cuando los datos son validos', async () => {
      // Arrange
      repositorio.findByEmail.mockResolvedValue(null);
      repositorio.save.mockImplementation(async (usuario) => new Usuario({ ...usuario, id_usuario: 1 }));

      // Act
      const resultado = await servicio.registrar(datosRegistro());

      // Assert
      const guardado = repositorio.save.mock.calls[0][0];
      expect(guardado).toBeInstanceOf(Usuario);
      expect(guardado.password).not.toBe('secreta123');
      expect(guardado.password).toMatch(/^\$2[aby]\$10\$/);
      expect(await bcrypt.compare('secreta123', guardado.password)).toBe(true);
      expect(resultado).toMatchObject({ id_usuario: 1, email: 'leo@example.com' });
      expect(resultado).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    test('rechaza una password incorrecta con codigo CREDENCIALES_INVALIDAS', async () => {
      // Arrange
      repositorio.findByEmail.mockResolvedValue(usuarioGuardado());

      // Act
      const login = servicio.login({ email: 'leo@example.com', password: 'incorrecta1' });

      // Assert
      await expect(login).rejects.toMatchObject({ codigo: 'CREDENCIALES_INVALIDAS' });
    });

    test('rechaza un usuario inexistente con codigo CREDENCIALES_INVALIDAS', async () => {
      // Arrange
      repositorio.findByEmail.mockResolvedValue(null);

      // Act
      const login = servicio.login({ email: 'nadie@example.com', password: 'secreta123' });

      // Assert
      await expect(login).rejects.toMatchObject({ codigo: 'CREDENCIALES_INVALIDAS' });
    });

    test('devuelve el usuario sin password cuando las credenciales son correctas', async () => {
      // Arrange
      repositorio.findByEmail.mockResolvedValue(usuarioGuardado());

      // Act
      const usuario = await servicio.login({ email: 'leo@example.com', password: 'secreta123' });

      // Assert
      expect(repositorio.findByEmail).toHaveBeenCalledWith('leo@example.com');
      expect(usuario).toMatchObject({ id_usuario: 1, nombre: 'Leo Ramos', email: 'leo@example.com' });
      expect(usuario).not.toHaveProperty('password');
    });
  });

  describe('listar', () => {
    test('devuelve los usuarios sin el campo password', async () => {
      // Arrange
      const otro = new Usuario({ ...usuarioGuardado(), id_usuario: 2, email: 'ana@example.com' });
      repositorio.findAll.mockResolvedValue([usuarioGuardado(), otro]);

      // Act
      const usuarios = await servicio.listar();

      // Assert
      expect(usuarios).toHaveLength(2);
      usuarios.forEach((usuario) => expect(usuario).not.toHaveProperty('password'));
      expect(usuarios.map((u) => u.email)).toEqual(['leo@example.com', 'ana@example.com']);
    });
  });
});
