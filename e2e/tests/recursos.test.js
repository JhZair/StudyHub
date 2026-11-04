const path = require('path');
const { By, until } = require('selenium-webdriver');
const { crearDriver, cerrarDriver } = require('../helpers/driver');

const URL_RECURSOS = 'http://localhost:5173/recursos';
const URL_API_RECURSOS = 'http://localhost:3000/api/recursos';
const RUTA_PDF = path.resolve(__dirname, '../fixtures/prueba.pdf');
const RUTA_PDF_VACIO = path.resolve(__dirname, '../fixtures/vacio.pdf');
const RUTA_TXT = path.resolve(__dirname, '../fixtures/nota.txt');
const ESPERA = 10000;
const ALERT_CAMPOS = 'Por favor completa todos los campos y selecciona un archivo.';
const ALERT_ERROR = 'Error al subir recurso';

const SELECTORES = {
  titulo: By.css('input[placeholder="Título"]'),
  descripcion: By.css('textarea[placeholder="Descripción"]'),
  archivo: By.css('input[type="file"]'),
  enviar: By.css('form button[type="submit"]'),
  tarjeta: By.css('main .grid > div')
};

let contador = 0;
const tituloUnico = (caso) => `${caso}-${Date.now()}-${contador++}`;

describe('Subir y listar recursos', () => {
  let driver;

  const abrirPagina = async () => {
    await driver.get(URL_RECURSOS);
    await driver.wait(until.elementLocated(SELECTORES.titulo), ESPERA);
    // axios usa XMLHttpRequest: se cuentan los envios y se guarda la ultima respuesta
    await driver.executeScript(`
      window.__subidas = 0;
      window.__ultimaRespuesta = null;
      const sendOriginal = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function (...args) {
        window.__subidas++;
        this.addEventListener('load', () => { window.__ultimaRespuesta = this.responseText; });
        return sendOriginal.apply(this, args);
      };
    `);
  };

  const llenarFormulario = async ({ titulo, descripcion, archivo }) => {
    if (titulo) await driver.findElement(SELECTORES.titulo).sendKeys(titulo);
    if (descripcion) await driver.findElement(SELECTORES.descripcion).sendKeys(descripcion);
    if (archivo) await driver.findElement(SELECTORES.archivo).sendKeys(archivo);
  };

  const enviarFormulario = () => driver.findElement(SELECTORES.enviar).click();

  // Acepta el alert y devuelve su texto
  const aceptarAlert = async () => {
    const alerta = await driver.wait(until.alertIsPresent(), ESPERA);
    const texto = await alerta.getText();
    await alerta.accept();
    return texto;
  };

  const estadoDeInput = (selector) => driver.executeScript(
    `const { valid, valueMissing } = arguments[0].validity;
     return { valid, valueMissing };`,
    driver.findElement(selector)
  );

  const subidas = () => driver.executeScript('return window.__subidas;');

  const errorDelBackend = async () => {
    const respuesta = await driver.executeScript('return window.__ultimaRespuesta;');
    return JSON.parse(respuesta).error;
  };

  beforeEach(async () => {
    driver = await crearDriver();
  });

  afterEach(async () => {
    await cerrarDriver(driver);
  });

  test('CP01 listar recursos: muestra los mismos titulos que la API', async () => {
    // Arrange
    const respuesta = await fetch(URL_API_RECURSOS);
    const recursos = await respuesta.json();
    const titulosEsperados = recursos.map((recurso) => recurso.titulo);

    // Act
    await abrirPagina();
    await driver.wait(
      async () => (await driver.findElements(SELECTORES.tarjeta)).length === recursos.length,
      ESPERA
    );
    const titulos = await driver.executeScript(
      "return [...document.querySelectorAll('main .grid > div h3')].map((h3) => h3.textContent);"
    );

    // Assert
    expect(titulos).toEqual(titulosEsperados);
  });

  test('CP02 subir sin archivo: el navegador bloquea el envio', async () => {
    // Arrange
    await abrirPagina();
    await llenarFormulario({ titulo: tituloUnico('cp02'), descripcion: 'Descripcion de cp02' });

    // Act
    await enviarFormulario();
    const estado = await estadoDeInput(SELECTORES.archivo);

    // Assert
    expect(estado.valid).toBe(false);
    expect(estado.valueMissing).toBe(true);
    expect(await subidas()).toBe(0);
  });

  test('CP03 subir sin titulo: el navegador bloquea el envio', async () => {
    // Arrange
    await abrirPagina();
    await llenarFormulario({ descripcion: 'Descripcion de cp03', archivo: RUTA_PDF });

    // Act
    await enviarFormulario();
    const estado = await estadoDeInput(SELECTORES.titulo);

    // Assert
    expect(estado.valid).toBe(false);
    expect(estado.valueMissing).toBe(true);
    expect(await subidas()).toBe(0);
  });

  test('CP04 subir sin descripcion: el navegador bloquea el envio', async () => {
    // Arrange
    await abrirPagina();
    await llenarFormulario({ titulo: tituloUnico('cp04'), archivo: RUTA_PDF });

    // Act
    await enviarFormulario();
    const estado = await estadoDeInput(SELECTORES.descripcion);

    // Assert
    expect(estado.valid).toBe(false);
    expect(estado.valueMissing).toBe(true);
    expect(await subidas()).toBe(0);
  });

  test('CP05 titulo solo con espacios: alert de campos incompletos', async () => {
    // Arrange
    await abrirPagina();
    await llenarFormulario({ titulo: '   ', descripcion: 'Descripcion de cp05', archivo: RUTA_PDF });

    // Act
    await enviarFormulario();
    const textoAlert = await aceptarAlert();

    // Assert
    expect(textoAlert).toBe(ALERT_CAMPOS);
    expect(await subidas()).toBe(0);
  });

  test('CP06 descripcion solo con espacios: alert de campos incompletos', async () => {
    // Arrange
    await abrirPagina();
    await llenarFormulario({ titulo: tituloUnico('cp06'), descripcion: '   ', archivo: RUTA_PDF });

    // Act
    await enviarFormulario();
    const textoAlert = await aceptarAlert();

    // Assert
    expect(textoAlert).toBe(ALERT_CAMPOS);
    expect(await subidas()).toBe(0);
  });

  test('CP07 selector de archivo: solo ofrece archivos PDF', async () => {
    // Arrange
    await abrirPagina();

    // Act
    const aceptados = await driver.findElement(SELECTORES.archivo).getAttribute('accept');

    // Assert
    expect(aceptados).toBe('application/pdf');
  });

  test('CP08 archivo de tipo no permitido: alert de error y el backend lo rechaza', async () => {
    // Arrange
    await abrirPagina();
    await llenarFormulario({ titulo: tituloUnico('cp08'), descripcion: 'Descripcion de cp08', archivo: RUTA_TXT });

    // Act
    await enviarFormulario();
    const textoAlert = await aceptarAlert();

    // Assert
    expect(textoAlert).toBe(ALERT_ERROR);
    expect(await errorDelBackend()).toBe('Tipo de recurso no permitido');
  });

  test('CP09 PDF de 0 bytes: alert de error y el backend lo rechaza', async () => {
    // Arrange
    await abrirPagina();
    await llenarFormulario({ titulo: tituloUnico('cp09'), descripcion: 'Descripcion de cp09', archivo: RUTA_PDF_VACIO });

    // Act
    await enviarFormulario();
    const textoAlert = await aceptarAlert();

    // Assert
    expect(textoAlert).toBe(ALERT_ERROR);
    expect(await errorDelBackend()).toBe('El tamaño del archivo debe ser mayor a cero');
  });
});
