const { By, until } = require('selenium-webdriver');
const { crearDriver, cerrarDriver } = require('../helpers/driver');
const preguntas = require('../../src/data/preguntas/matematica-i.json');
const preguntasCalculo = require('../../src/data/preguntas/calculo-i.json');

const URL_BASE = 'http://localhost:5173';
const URL_EXAMEN = `${URL_BASE}/simulacros/matematica-i`;
const URL_API_SIGNUP = 'http://localhost:3000/api/auth/signup';
const ESPERA = 10000;
const TOTAL = preguntas.length;

const SELECTORES = {
  pregunta: By.css('main div.mb-6'),
  opcion: By.css('button'),
  finalizar: By.xpath("//button[normalize-space()='Finalizar examen']"),
  puntaje: By.xpath("//main//div[contains(text(), 'Tu puntaje final')]"),
  correcta: By.css('span.text-green-400'),
  incorrecta: By.css('span.text-red-400'),
  sinResponder: By.css('span.text-yellow-300')
};

const indiceCorrecta = (pregunta) => pregunta.opciones.indexOf(pregunta.respuestaCorrecta);
const indiceIncorrecta = (pregunta) => pregunta.opciones.findIndex((o) => o !== pregunta.respuestaCorrecta);

describe('Rendir un simulacro', () => {
  let driver;

  const abrirExamen = async () => {
    await driver.get(URL_EXAMEN);
    await driver.wait(until.elementsLocated(SELECTORES.pregunta), ESPERA);
  };

  const opcionDe = async (indicePregunta, indiceOpcion) => {
    const tarjetas = await driver.findElements(SELECTORES.pregunta);
    const opciones = await tarjetas[indicePregunta].findElements(SELECTORES.opcion);
    return opciones[indiceOpcion];
  };

  const responder = async (indicePregunta, indiceOpcion) => {
    const opcion = await opcionDe(indicePregunta, indiceOpcion);
    await opcion.click();
  };

  // Devuelve el texto del puntaje mostrado al finalizar
  const finalizar = async () => {
    await driver.findElement(SELECTORES.finalizar).click();
    const puntaje = await driver.wait(until.elementLocated(SELECTORES.puntaje), ESPERA);
    return puntaje.getText();
  };

  const contar = async (selector) => (await driver.findElements(selector)).length;

  beforeEach(async () => {
    driver = await crearDriver();
  });

  afterEach(async () => {
    await cerrarDriver(driver);
  });

  test('CP01 responder todo bien: puntaje 10 / 10', async () => {
    // Arrange
    await abrirExamen();
    for (const [i, pregunta] of preguntas.entries()) {
      await responder(i, indiceCorrecta(pregunta));
    }

    // Act
    const puntaje = await finalizar();

    // Assert
    expect(puntaje).toBe(`Tu puntaje final: ${TOTAL} / ${TOTAL}`);
    expect(await contar(SELECTORES.correcta)).toBe(TOTAL);
    expect(await contar(SELECTORES.incorrecta)).toBe(0);
  });

  test('CP02 responder todo mal: puntaje 0 / 10', async () => {
    // Arrange
    await abrirExamen();
    for (const [i, pregunta] of preguntas.entries()) {
      await responder(i, indiceIncorrecta(pregunta));
    }

    // Act
    const puntaje = await finalizar();

    // Assert
    expect(puntaje).toBe(`Tu puntaje final: 0 / ${TOTAL}`);
    expect(await contar(SELECTORES.incorrecta)).toBe(TOTAL);
    expect(await contar(SELECTORES.correcta)).toBe(0);
  });

  test('CP03 enviar sin responder: puntaje 0 / 10 y todas sin responder', async () => {
    // Arrange
    await abrirExamen();

    // Act
    const puntaje = await finalizar();

    // Assert
    expect(puntaje).toBe(`Tu puntaje final: 0 / ${TOTAL}`);
    expect(await contar(SELECTORES.sinResponder)).toBe(TOTAL);
  });

  test('CP04 una sola respuesta correcta: puntaje 1 / 10', async () => {
    // Arrange
    await abrirExamen();
    for (const [i, pregunta] of preguntas.entries()) {
      await responder(i, i === 0 ? indiceCorrecta(pregunta) : indiceIncorrecta(pregunta));
    }

    // Act
    const puntaje = await finalizar();

    // Assert
    expect(puntaje).toBe(`Tu puntaje final: 1 / ${TOTAL}`);
    expect(await contar(SELECTORES.correcta)).toBe(1);
  });

  test('CP05 una sola respuesta incorrecta: puntaje 9 / 10', async () => {
    // Arrange
    await abrirExamen();
    for (const [i, pregunta] of preguntas.entries()) {
      await responder(i, i === 0 ? indiceIncorrecta(pregunta) : indiceCorrecta(pregunta));
    }

    // Act
    const puntaje = await finalizar();

    // Assert
    expect(puntaje).toBe(`Tu puntaje final: 9 / ${TOTAL}`);
    expect(await contar(SELECTORES.incorrecta)).toBe(1);
  });

  test('CP06 respuestas mezcladas: 5 bien, 3 mal y 2 sin responder dan 5 / 10', async () => {
    // Arrange
    await abrirExamen();
    for (const [i, pregunta] of preguntas.slice(0, 5).entries()) {
      await responder(i, indiceCorrecta(pregunta));
    }
    for (const [i, pregunta] of preguntas.slice(5, 8).entries()) {
      await responder(i + 5, indiceIncorrecta(pregunta));
    }

    // Act
    const puntaje = await finalizar();

    // Assert
    expect(puntaje).toBe(`Tu puntaje final: 5 / ${TOTAL}`);
    expect(await contar(SELECTORES.correcta)).toBe(5);
    expect(await contar(SELECTORES.incorrecta)).toBe(3);
    expect(await contar(SELECTORES.sinResponder)).toBe(2);
  });

  test('CP07 cambiar de respuesta: cuenta la ultima seleccionada', async () => {
    // Arrange
    await abrirExamen();
    await responder(0, indiceIncorrecta(preguntas[0]));
    await responder(0, indiceCorrecta(preguntas[0]));

    // Act
    const puntaje = await finalizar();

    // Assert
    expect(puntaje).toBe(`Tu puntaje final: 1 / ${TOTAL}`);
    expect(await contar(SELECTORES.correcta)).toBe(1);
  });

  test('CP08 examen finalizado: no se puede volver a responder ni finalizar', async () => {
    // Arrange
    await abrirExamen();
    await responder(0, indiceCorrecta(preguntas[0]));
    await finalizar();
    const otraOpcion = await opcionDe(0, indiceIncorrecta(preguntas[0]));

    // Act
    await driver.executeScript('arguments[0].click();', otraOpcion);
    const clases = await otraOpcion.getAttribute('class');

    // Assert
    expect(clases).toContain('pointer-events-none');
    expect(clases).not.toContain('bg-blue-700');
    expect(await contar(SELECTORES.correcta)).toBe(1);
    expect(await contar(SELECTORES.finalizar)).toBe(0);
  });

  test('CP09 elegir curso desde el listado: carga sus preguntas', async () => {
    // Arrange
    await driver.get(`${URL_BASE}/simulacros`);
    const semestre = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Semestre III')]")),
      ESPERA
    );
    await semestre.click();
    const curso = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Cálculo I']")), ESPERA);

    // Act
    await curso.click();
    await driver.wait(until.urlContains('/simulacros/calculo-i'), ESPERA);
    await driver.wait(until.elementsLocated(SELECTORES.pregunta), ESPERA);

    // Assert
    expect(await contar(SELECTORES.pregunta)).toBe(preguntasCalculo.length);
    expect(await driver.findElement(SELECTORES.pregunta).getText()).toContain(preguntasCalculo[0].opciones[0]);
  });

  test('CP10 curso sin preguntas: mensaje de error y sin boton de finalizar', async () => {
    // Arrange
    const url = `${URL_BASE}/simulacros/curso-inexistente`;

    // Act
    await driver.get(url);
    const error = await driver.wait(until.elementLocated(By.css('main p.text-red-500')), ESPERA);

    // Assert
    expect(await error.getText()).toBe('No se pudieron cargar las preguntas.');
    expect(await contar(SELECTORES.finalizar)).toBe(0);
  });

  describe('con sesion iniciada', () => {
    const usuario = {
      nombre: 'Usuario Simulacro',
      email: `simulacro.${Date.now()}@example.com`,
      password: 'claveSegura1',
      universidad: 'ucsp'
    };

    beforeAll(async () => {
      const respuesta = await fetch(URL_API_SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      expect(respuesta.ok).toBe(true);
    });

    beforeEach(async () => {
      await driver.get(`${URL_BASE}/login`);
      const email = await driver.wait(until.elementLocated(By.css('input[type="email"]')), ESPERA);
      await email.sendKeys(usuario.email);
      await driver.findElement(By.css('input#password')).sendKeys(usuario.password);
      await driver.findElement(By.css('button.submit-btn')).click();
      await driver.wait(until.urlContains('/simulacros'), ESPERA);
    });

    test('CP11 rendir con sesion iniciada: muestra el puntaje', async () => {
      // Arrange
      await abrirExamen();
      await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Cerrar sesión']")), ESPERA);
      for (const [i, pregunta] of preguntas.entries()) {
        await responder(i, indiceCorrecta(pregunta));
      }

      // Act
      const puntaje = await finalizar();

      // Assert
      expect(puntaje).toBe(`Tu puntaje final: ${TOTAL} / ${TOTAL}`);
    });
  });
});
