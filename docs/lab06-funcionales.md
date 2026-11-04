# Lab 06 — Pruebas funcionales con Selenium

## Objetivo
Automatizar pruebas funcionales de caja negra de StudyHub con
Selenium WebDriver y Jest como framework xUnit.

## Alcance
- El proyecto de pruebas va en la carpeta e2e/ de la raiz, con su
  propio package.json. Es independiente de backend/ y del frontend.
- No modificar backend/ ni src/. Si un elemento no se puede ubicar
  con ningun selector, preguntar antes de tocar el frontend.
- Las pruebas corren contra la app levantada en local:
  frontend http://localhost:5173, backend http://localhost:3000.

## Herramientas
- selenium-webdriver. Selenium Manager descarga chromedriver solo.
- jest como framework xUnit.
- Chrome instalado en el sistema.
- Headless por defecto; con HEADLESS=false se ve el navegador.

## Estructura
e2e/
├── package.json
├── jest.config.js
├── helpers/driver.js     crea y cierra el WebDriver
├── fixtures/             archivos de prueba, por ejemplo un PDF
└── tests/
    ├── registro.test.js      Zair
    ├── recursos.test.js      Leonardo
    └── simulacros.test.js    Mauricio

## Reglas
- Un test por caso de prueba, con su ID en el nombre: CP01, CP02...
- beforeEach crea el driver y afterEach lo cierra: SetUp y TearDown.
- Patron AAA con // Arrange // Act // Assert rotulados.
- Esperas explicitas: until.elementLocated, until.urlContains,
  until.alertIsPresent. Nunca sleep.
- Datos unicos por ejecucion, por ejemplo emails con timestamp,
  para que las pruebas se puedan repetir.
- Los archivos de prueba corren en serie (--runInBand).

## Casos de prueba
Cada funcionalidad documenta sus casos en
docs/casos-funcionales-<funcionalidad>.md con la tabla:
Objeto de Prueba / Funcionalidad | Escenario/Acciones | Valores de Prueba | Resultado Esperado
Indicar la tecnica de caja negra: clases de equivalencia, valores
limite o tablas de decision.

## Convenciones
- Rama development.
- Commits: test(e2e): <descripcion>
