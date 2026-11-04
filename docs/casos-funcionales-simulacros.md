# Casos funcionales — Rendir un simulacro

Pruebas de caja negra con Selenium WebDriver y Jest en
`e2e/tests/simulacros.test.js`. Corren contra la app en local: frontend
`http://localhost:5173`, backend `http://localhost:3000`.

Ejecutar desde `e2e/`:

```
npx jest tests/simulacros.test.js --runInBand --verbose
```

Las pantallas de simulacros no exigen sesión. CP11 inicia sesión para cubrir
también ese flujo: crea un usuario único por la API en `beforeAll` y entra por
la interfaz en `beforeEach`.

Salvo CP09 y CP10, los casos usan el examen `/simulacros/matematica-i`, de 10
preguntas. Las respuestas correctas se leen de
`src/data/preguntas/matematica-i.json`, sin modificarlo.

## Casos de prueba

| Objeto de Prueba / Funcionalidad | Escenario/Acciones | Valores de Prueba | Resultado Esperado |
|---|---|---|---|
| CP01 — Rendir simulacro | Responder bien todas las preguntas y finalizar | 10 respuestas correctas | `Tu puntaje final: 10 / 10`; 10 marcas `✔ Correcta`; ninguna incorrecta |
| CP02 — Rendir simulacro | Responder mal todas las preguntas y finalizar | 10 respuestas incorrectas | `Tu puntaje final: 0 / 10`; 10 marcas `✘ Incorrecta`; ninguna correcta |
| CP03 — Rendir simulacro | Finalizar sin responder | 0 respuestas | `Tu puntaje final: 0 / 10`; 10 marcas `⚠ Sin responder` |
| CP04 — Rendir simulacro | Responder bien solo la primera pregunta y mal las demás | 1 correcta, 9 incorrectas | `Tu puntaje final: 1 / 10`; 1 marca `✔ Correcta` |
| CP05 — Rendir simulacro | Responder mal solo la primera pregunta y bien las demás | 9 correctas, 1 incorrecta | `Tu puntaje final: 9 / 10`; 1 marca `✘ Incorrecta` |
| CP06 — Rendir simulacro | Combinar respuestas correctas, incorrectas y sin responder | 5 correctas, 3 incorrectas, 2 sin responder | `Tu puntaje final: 5 / 10`; 5 correctas, 3 incorrectas y 2 sin responder |
| CP07 — Rendir simulacro | Elegir una opción incorrecta, cambiarla por la correcta y finalizar | Primera pregunta: incorrecta y luego correcta | `Tu puntaje final: 1 / 10`: cuenta la última selección |
| CP08 — Rendir simulacro | Finalizar e intentar elegir otra opción | Clic en otra opción de la primera pregunta | La opción no queda seleccionada y tiene `pointer-events-none`; el resultado no cambia; desaparece `Finalizar examen` |
| CP09 — Elegir curso | En `/simulacros`, abrir `Semestre III` y elegir un curso con tilde | Curso `Cálculo I` | Va a `/simulacros/calculo-i` y muestra las 10 preguntas de ese curso |
| CP10 — Elegir curso | Abrir un examen de un curso que no existe | `/simulacros/curso-inexistente` | Mensaje `No se pudieron cargar las preguntas.`; sin botón `Finalizar examen` |
| CP11 — Rendir simulacro con sesión | Iniciar sesión, responder bien todas las preguntas y finalizar | Usuario único con timestamp, contraseña `claveSegura1`; 10 respuestas correctas | Se ve `Cerrar sesión` y `Tu puntaje final: 10 / 10` |

## Técnicas de caja negra

| Técnica | Casos | Justificación |
|---|---|---|
| Valores límite | CP01, CP02, CP04 y CP05 | El puntaje va de 0 a 10: se prueban los extremos, 0 y 10, y sus vecinos, 1 y 9 |
| Clases de equivalencia | CP01, CP02 y CP03 | Clases de respuesta: correcta, incorrecta y sin responder |
| Clases de equivalencia | CP09 y CP10 | Curso con preguntas y curso inexistente |
| Clases de equivalencia | CP01 y CP11 | Examen sin sesión y con sesión |
| Tablas de decisión | CP06 | Combina las tres clases de respuesta en un mismo examen |
| Transición de estados | CP07 y CP08 | Cambiar de respuesta antes de finalizar y bloqueo después de finalizar |

## Casos descartados

**El puntaje se guarda y aparece en el perfil:** no se puede implementar sin
modificar `backend/`. `src/pages/Examen.jsx` envía el resultado a
`POST /api/puntajes/guardar` y `src/pages/Profile.jsx` lo consulta en
`GET /api/puntajes/usuario/:id`, pero esas rutas no existen: el `POST` responde
`404`. La pantalla captura el error, solo lo registra en la consola y muestra el
puntaje igual, así que hoy el resultado no se guarda.

**Examen de Trivia:** queda fuera porque `/simulacros/trivia` obtiene las
preguntas de un servicio externo (`opentdb.com`), con preguntas aleatorias.
