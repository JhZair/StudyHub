const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Headless por defecto; con HEADLESS=false se ve el navegador
async function crearDriver() {
  const opciones = new chrome.Options();
  if (process.env.HEADLESS !== 'false') {
    opciones.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900');
  }
  return new Builder().forBrowser('chrome').setChromeOptions(opciones).build();
}

async function cerrarDriver(driver) {
  if (driver) {
    await driver.quit();
  }
}

module.exports = { crearDriver, cerrarDriver };
