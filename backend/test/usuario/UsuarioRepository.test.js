jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const db = require('../../src/config/database');
const UsuarioRepository = require('../../src/usuario/UsuarioRepository');
const Usuario = require('../../src/usuario/model/Usuario');

const filaAna = () => ({
  id_usuario: 1,
  nombre: 'Ana García',
  email: 'ana.garcia@example.com',
  password: '$2b$10$aCzSkPPNWn7.FIa8JXqX9ejxPXxSe5meEVWtTIWOr36YyQko4FlrK',
  universidad: 'Universidad Nacional',
  fecha_registro: new Date('2023-01-15T00:00:00Z'),
  ultimo_acceso: new Date('2023-06-20T00:00:00Z')
});

const nuevoUsuario = () => new Usuario({
  nombre: 'Leo Ramos',
  email: 'leo@example.com',
  password: '$2b$10$I4qY42Pe88X.rStFdDM1ceWjUxKOKWT2f.sepw6PHXG3sTUl71AKG',
  universidad: 'UCSP',
  fecha_registro: new Date('2026-10-26T10:00:00Z'),
  ultimo_acceso: new Date('2026-10-26T10:00:00Z')
});

describe('UsuarioRepository', () => {
  let repositorio;

  beforeEach(() => {
    db.query.mockReset();
    repositorio = new UsuarioRepository(db);
  });

  test('findByEmail devuelve un Usuario cuando el email existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[filaAna()], []]);

    // Act
    const usuario = await repositorio.findByEmail('ana.garcia@example.com');

    // Assert
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM usuario WHERE email = ?', ['ana.garcia@example.com']);
    expect(usuario).toBeInstanceOf(Usuario);
    expect(usuario).toMatchObject(filaAna());
  });

  test('findByEmail devuelve null cuando el email no existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[], []]);

    // Act
    const usuario = await repositorio.findByEmail('nadie@example.com');

    // Assert
    expect(usuario).toBeNull();
  });

  test('findById devuelve un Usuario cuando el id existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[filaAna()], []]);

    // Act
    const usuario = await repositorio.findById(1);

    // Assert
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM usuario WHERE id_usuario = ?', [1]);
    expect(usuario).toBeInstanceOf(Usuario);
    expect(usuario).toMatchObject(filaAna());
  });

  test('findById devuelve null cuando el id no existe', async () => {
    // Arrange
    db.query.mockResolvedValue([[], []]);

    // Act
    const usuario = await repositorio.findById(999);

    // Assert
    expect(usuario).toBeNull();
  });

  test('save inserta el usuario y lo devuelve con el id generado', async () => {
    // Arrange
    const usuario = nuevoUsuario();
    db.query.mockResolvedValue([{ insertId: 7 }, undefined]);

    // Act
    const guardado = await repositorio.save(usuario);

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO usuario (nombre, email, password, universidad, fecha_registro, ultimo_acceso) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario.nombre, usuario.email, usuario.password, usuario.universidad, usuario.fecha_registro, usuario.ultimo_acceso]
    );
    expect(guardado).toBeInstanceOf(Usuario);
    expect(guardado).toMatchObject({ ...usuario, id_usuario: 7 });
  });

  test('findAll devuelve todas las filas como instancias de Usuario', async () => {
    // Arrange
    const filaCarlos = { ...filaAna(), id_usuario: 2, nombre: 'Carlos Méndez', email: 'carlos.mendez@example.com' };
    db.query.mockResolvedValue([[filaAna(), filaCarlos], []]);

    // Act
    const usuarios = await repositorio.findAll();

    // Assert
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM usuario');
    expect(usuarios).toHaveLength(2);
    usuarios.forEach((usuario) => expect(usuario).toBeInstanceOf(Usuario));
    expect(usuarios.map((u) => u.email)).toEqual(['ana.garcia@example.com', 'carlos.mendez@example.com']);
  });

  test('save traduce ER_DUP_ENTRY de MySQL a un error de negocio EMAIL_DUPLICADO', async () => {
    // Arrange
    const errorMysql = Object.assign(new Error("Duplicate entry 'leo@example.com' for key 'email'"), { code: 'ER_DUP_ENTRY' });
    db.query.mockRejectedValue(errorMysql);

    // Act
    const guardar = repositorio.save(nuevoUsuario());

    // Assert
    await expect(guardar).rejects.toMatchObject({ codigo: 'EMAIL_DUPLICADO', message: 'Correo ya registrado' });
  });

  test('save propaga sin traducir un error de MySQL distinto de ER_DUP_ENTRY', async () => {
    // Arrange
    const errorMysql = Object.assign(new Error('Connection lost'), { code: 'PROTOCOL_CONNECTION_LOST' });
    db.query.mockRejectedValue(errorMysql);

    // Act
    const guardar = repositorio.save(nuevoUsuario());

    // Assert
    await expect(guardar).rejects.toBe(errorMysql);
    await expect(guardar).rejects.not.toHaveProperty('codigo');
  });
});
