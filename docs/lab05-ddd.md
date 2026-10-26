# Refactor DDD — Lab 05

## Objetivo
Refactorizar el backend de StudyHub a organización por dominio (DDD)
para escribir pruebas unitarias con Jest y dobles de prueba.

## Alcance
SOLO la carpeta backend/. No tocar src/, public/ ni index.html de la
raiz: eso es el frontend React y queda fuera del lab.

## Restricciones
- El backend usa CommonJS (require / module.exports). Mantenerlo.
- backend/package.json es independiente del de la raiz.
- backend/index.js sigue siendo el punto de entrada.
- La app debe seguir funcionando despues de cada fase.
- Jest ya trae jest.mock y jest.fn(). No instalar Sinon.

## Estructura destino

backend/
├── index.js
├── package.json
├── src/
│   ├── config/
│   │   └── database.js
│   ├── usuario/
│   │   ├── AuthController.js
│   │   ├── UsuarioController.js
│   │   ├── UsuarioService.js
│   │   ├── UsuarioRepository.js
│   │   └── model/
│   │       ├── Usuario.js
│   │       └── IUsuarioRepository.js
│   ├── recurso/
│   ├── simulacro/
│   └── curso/
└── test/
    ├── usuario/
    ├── recurso/
    ├── simulacro/
    └── curso/

## Mapeo de archivos actuales

routes/db.js         -> src/config/database.js
routes/auth.js       -> src/usuario/AuthController.js
routes/usuarios.js   -> src/usuario/UsuarioController.js
routes/recursos.js   -> src/recurso/RecursoController.js
routes/simulacros.js -> src/simulacro/SimulacroController.js
routes/cursos.js     -> src/curso/CursoController.js

## Capas dentro de cada modulo

- model/<Entidad>.js: entidad de dominio. Valida invariantes en el
  constructor y lanza Error si no se cumplen.
- model/I<Entidad>Repository.js: interfaz como clase abstracta.
  Cada metodo lanza Error("No implementado").
- <Entidad>Repository.js: implementacion con mysql2. Unica capa que
  conoce SQL. Extiende la interfaz.
- <Entidad>Service.js: recibe el repositorio por constructor.
  Contiene la logica de aplicacion.
- <Entidad>Controller.js: rutas Express. Solo llama al servicio.

## Convenciones
- Rama de trabajo: development. Nunca commitear a main.
- Cada commit termina con: Fix #<numero-de-issue>
- Un commit por fase.

## Reparto
- usuario: Zair
- recurso: Leonardo
- simulacro y curso: Mauricio

Refactorizar a fondo solo el modulo usuario. Los demas se mueven de
carpeta en la Fase 1, pero sus internos los refactoriza su responsable.
