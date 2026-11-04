const { By, until } = require('selenium-webdriver');
const { crearDriver, cerrarDriver } = require('../helpers/driver');

const URL_SIGNUP = 'http://localhost:5173/signup';
const URL_API_SIGNUP = 'http://localhost:3000/api/auth/signup';
const ESPERA = 10000;

const SELECTORES = {
  nombre: By.css('input[placeholder="Nombre completo"]'),
  email: By.css('input[placeholder="Correo electrónico"]'),
  password: By.css('input[placeholder="Contraseña"]'),
  confirmar: By.css('input[placeholder="Confirmar Contraseña"]'),
  enviar: By.css('button.submit-btn'),
  error: By.css('form.form p')
};

let contador = 0;
const emailUnico = (caso) => `${caso}.${Date.now()}.${contador++}@example.com`;

describe('Registro de usuario', () => {
  let driver;

  const abrirFormulario = async () => {
    await driver.get(URL_SIGNUP);
    await driver.wait(until.elementLocated(SELECTORES.nombre), ESPERA);
    // Cuenta las llamadas a fetch para comprobar si el envio llego a salir
    await driver.executeScript(`
      window.__llamadasFetch = 0;
      const fetchOriginal = window.fetch;
      window.fetch = (...args) => {
        window.__llamadasFetch++;
        return fetchOriginal(...args);
      };
    `);
  };

  const llenarFormulario = async ({ nombre, email, password, confirmar = password }) => {
    await driver.findElement(SELECTORES.nombre).sendKeys(nombre);
    await driver.findElement(SELECTORES.email).sendKeys(email);
    await driver.findElement(SELECTORES.password).sendKeys(password);
    await driver.findElement(SELECTORES.confirmar).sendKeys(confirmar);
  };

  const enviarFormulario = () => driver.findElement(SELECTORES.enviar).click();

  const leerError = async () => {
    const error = await driver.wait(until.elementLocated(SELECTORES.error), ESPERA);
    return error.getText();
  };

  // Acepta el alert y devuelve su texto
  const aceptarAlert = async () => {
    const alerta = await driver.wait(until.alertIsPresent(), ESPERA);
    const texto = await alerta.getText();
    await alerta.accept();
    return texto;
  };

  const estadoDeInput = (selector) => driver.executeScript(
    `const { valid, valueMissing, typeMismatch } = arguments[0].validity;
     return { valid, valueMissing, typeMismatch };`,
    driver.findElement(selector)
  );

  const llamadasFetch = () => driver.executeScript('return window.__llamadasFetch;');

  beforeEach(async () => {
    driver = await crearDriver();
  });

  afterEach(async () => {
    await cerrarDriver(driver);
  });

  test('CP01 datos validos: alert de exito y luego /login', async () => {
    // Arrange
    await abrirFormulario();
    await llenarFormulario({ nombre: 'Ana García', email: emailUnico('cp01'), password: 'claveSegura1' });

    // Act
    await enviarFormulario();
    const textoAlert = await aceptarAlert();
    await driver.wait(until.urlContains('/login'), ESPERA);

    // Assert
    expect(textoAlert).toBe('Registro exitoso. Ahora inicia sesión.');
    expect(await driver.getCurrentUrl()).toContain('/login');
  });

  test('CP02 email ya registrado: mensaje "Correo ya registrado"', async () => {
    // Arrange
    const email = emailUnico('cp02');
    const respuesta = await fetch(URL_API_SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Ana García', email, password: 'claveSegura1', universidad: 'ucsp' })
    });
    expect(respuesta.ok).toBe(true);
    await abrirFormulario();
    await llenarFormulario({ nombre: 'Ana García', email, password: 'claveSegura1' });

    // Act
    await enviarFormulario();
    const mensaje = await leerError();

    // Assert
    expect(mensaje).toBe('Correo ya registrado');
    expect(await driver.getCurrentUrl()).toContain('/signup');
  });

  test('CP03 email ana.example.com: el navegador bloquea el envio', async () => {
    // Arrange
    await abrirFormulario();
    await llenarFormulario({ nombre: 'Ana García', email: 'ana.example.com', password: 'claveSegura1' });

    // Act
    await enviarFormulario();
    const estado = await estadoDeInput(SELECTORES.email);

    // Assert
    expect(estado.valid).toBe(false);
    expect(estado.typeMismatch).toBe(true);
    expect(await llamadasFetch()).toBe(0);
    expect(await driver.getCurrentUrl()).toContain('/signup');
  });

  test('CP04 password clave12 de 7 caracteres: mensaje de longitud minima', async () => {
    // Arrange
    await abrirFormulario();
    await llenarFormulario({ nombre: 'Ana García', email: emailUnico('cp04'), password: 'clave12' });

    // Act
    await enviarFormulario();
    const mensaje = await leerError();

    // Assert
    expect(mensaje).toBe('La password debe tener al menos 8 caracteres');
    expect(await driver.getCurrentUrl()).toContain('/signup');
  });

  test('CP05 password clave123 de 8 caracteres: alert de exito y luego /login', async () => {
    // Arrange
    await abrirFormulario();
    await llenarFormulario({ nombre: 'Ana García', email: emailUnico('cp05'), password: 'clave123' });

    // Act
    await enviarFormulario();
    const textoAlert = await aceptarAlert();
    await driver.wait(until.urlContains('/login'), ESPERA);

    // Assert
    expect(textoAlert).toBe('Registro exitoso. Ahora inicia sesión.');
    expect(await driver.getCurrentUrl()).toContain('/login');
  });

  test('CP06 contraseñas que no coinciden: mensaje "Las contraseñas no coinciden"', async () => {
    // Arrange
    await abrirFormulario();
    await llenarFormulario({
      nombre: 'Ana García',
      email: emailUnico('cp06'),
      password: 'claveSegura1',
      confirmar: 'claveSegura2'
    });

    // Act
    await enviarFormulario();
    const mensaje = await leerError();

    // Assert
    expect(mensaje).toBe('Las contraseñas no coinciden');
    expect(await llamadasFetch()).toBe(0);
    expect(await driver.getCurrentUrl()).toContain('/signup');
  });

  test('CP07 formulario vacio: el navegador bloquea el envio', async () => {
    // Arrange
    await abrirFormulario();

    // Act
    await enviarFormulario();
    const estado = await estadoDeInput(SELECTORES.nombre);

    // Assert
    expect(estado.valid).toBe(false);
    expect(estado.valueMissing).toBe(true);
    expect(await llamadasFetch()).toBe(0);
    expect(await driver.getCurrentUrl()).toContain('/signup');
  });

  test('CP08 email ana@example: mensaje "El email no tiene un formato valido"', async () => {
    // Arrange
    await abrirFormulario();
    await llenarFormulario({ nombre: 'Ana García', email: 'ana@example', password: 'claveSegura1' });

    // Act
    await enviarFormulario();
    const mensaje = await leerError();

    // Assert
    expect(mensaje).toBe('El email no tiene un formato valido');
    expect(await driver.getCurrentUrl()).toContain('/signup');
  });
});
