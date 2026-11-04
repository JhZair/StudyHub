const { By, until } = require('selenium-webdriver');
const { crearDriver, cerrarDriver } = require('../helpers/driver');

const URL_FRONTEND = 'http://localhost:5173';

describe('Humo', () => {
  let driver;

  beforeEach(async () => {
    driver = await crearDriver();
  });

  afterEach(async () => {
    await cerrarDriver(driver);
  });

  test('la aplicacion carga en el navegador', async () => {
    // Arrange
    const url = URL_FRONTEND;

    // Act
    await driver.get(url);
    const contenido = await driver.wait(until.elementLocated(By.css('#root > *')), 10000);

    // Assert
    expect(await driver.getCurrentUrl()).toContain(url);
    expect(await contenido.isDisplayed()).toBe(true);
  });
});
