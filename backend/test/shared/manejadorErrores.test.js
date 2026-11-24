jest.mock('../../src/config/database', () => ({ query: jest.fn() }));

const manejadorErrores = require('../../src/shared/manejadorErrores');

const errorDeNegocio = (codigo, mensaje) => Object.assign(new Error(mensaje), { codigo });

const crearRes = (locals = {}) => {
  const res = { locals, headersSent: false };
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('manejadorErrores', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  test.each([
    ['VALIDACION', 400, 'Faltan campos'],
    ['EMAIL_DUPLICADO', 400, 'Correo ya registrado'],
    ['CREDENCIALES_INVALIDAS', 401, 'Credenciales inválidas']
  ])('traduce %s a %i con el mensaje del error', (codigo, status, mensaje) => {
    // Arrange
    const res = crearRes();
    const next = jest.fn();

    // Act
    manejadorErrores(errorDeNegocio(codigo, mensaje), {}, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ error: mensaje });
    expect(consoleError).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('un error sin codigo responde 500 generico, sin exponer el mensaje, y lo registra', () => {
    // Arrange
    const error = new Error("Unknown column 'x' in 'field list'");
    const res = crearRes();

    // Act
    manejadorErrores(error, {}, res, jest.fn());

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error en el servidor' });
    expect(consoleError).toHaveBeenCalledWith('Error no controlado:', error);
  });

  test('un codigo desconocido responde 500', () => {
    // Arrange
    const res = crearRes();

    // Act
    manejadorErrores(errorDeNegocio('OTRO', 'algo raro'), {}, res, jest.fn());

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error en el servidor' });
  });

  test('usa los mensajes que la ruta declara en res.locals.mensajesError', () => {
    // Arrange
    const mensajesError = { EMAIL_DUPLICADO: 'Ya existe una cuenta con ese correo electrónico', INTERNO: 'Error al registrar usuario' };
    const resDuplicado = crearRes({ mensajesError });
    const resInterno = crearRes({ mensajesError });

    // Act
    manejadorErrores(errorDeNegocio('EMAIL_DUPLICADO', 'Correo ya registrado'), {}, resDuplicado, jest.fn());
    manejadorErrores(new Error('caida de la base'), {}, resInterno, jest.fn());

    // Assert
    expect(resDuplicado.status).toHaveBeenCalledWith(400);
    expect(resDuplicado.json).toHaveBeenCalledWith({ error: 'Ya existe una cuenta con ese correo electrónico' });
    expect(resInterno.status).toHaveBeenCalledWith(500);
    expect(resInterno.json).toHaveBeenCalledWith({ error: 'Error al registrar usuario' });
  });

  test('si la respuesta ya empezo a enviarse delega en el manejador de Express', () => {
    // Arrange
    const error = new Error('fallo a mitad de respuesta');
    const res = { ...crearRes(), headersSent: true };
    const next = jest.fn();

    // Act
    manejadorErrores(error, {}, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});
