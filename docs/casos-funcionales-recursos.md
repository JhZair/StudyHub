# Casos funcionales — Subir y listar recursos

Pruebas de caja negra con Selenium WebDriver y Jest en
`e2e/tests/recursos.test.js`. Corren contra la app en local: frontend
`http://localhost:5173`, backend `http://localhost:3000`.

Ejecutar desde `e2e/`:

```
npx jest tests/recursos.test.js --runInBand --verbose
```

La pantalla `/recursos` no exige sesión: las pruebas no inician sesión.

## Casos de prueba

| Objeto de Prueba / Funcionalidad | Escenario/Acciones | Valores de Prueba | Resultado Esperado |
|---|---|---|---|
| CP01 — Listar recursos | Consultar `GET /api/recursos` y abrir `/recursos` | Los recursos que haya en la base | Se muestra una tarjeta por recurso, con los mismos títulos y en el mismo orden que la API |
| CP02 — Subir recurso | Llenar título y descripción, sin archivo, y enviar | Título único con timestamp; descripción `Descripcion de cp02`; sin archivo | El navegador bloquea el envío: `validity.valueMissing` en el archivo; no se llama al backend |
| CP03 — Subir recurso | Llenar descripción y archivo, sin título, y enviar | Título vacío; `fixtures/prueba.pdf` | El navegador bloquea el envío: `validity.valueMissing` en el título; no se llama al backend |
| CP04 — Subir recurso | Llenar título y archivo, sin descripción, y enviar | Descripción vacía; `fixtures/prueba.pdf` | El navegador bloquea el envío: `validity.valueMissing` en la descripción; no se llama al backend |
| CP05 — Subir recurso | Enviar con un título de solo espacios | Título `'   '`; `fixtures/prueba.pdf` | Alert `Por favor completa todos los campos y selecciona un archivo.`; no se llama al backend |
| CP06 — Subir recurso | Enviar con una descripción de solo espacios | Descripción `'   '`; `fixtures/prueba.pdf` | Alert `Por favor completa todos los campos y selecciona un archivo.`; no se llama al backend |
| CP07 — Subir recurso | Revisar el selector de archivo | Atributo `accept` del input | `accept` es `application/pdf` |
| CP08 — Subir recurso | Enviar con un archivo de tipo no permitido | `fixtures/nota.txt` | Alert `Error al subir recurso`; el backend responde `Tipo de recurso no permitido` |
| CP09 — Subir recurso | Enviar con un PDF de 0 bytes | `fixtures/vacio.pdf` | Alert `Error al subir recurso`; el backend responde `El tamaño del archivo debe ser mayor a cero` |

## Técnicas de caja negra

| Técnica | Casos | Justificación |
|---|---|---|
| Clases de equivalencia | CP02, CP03, CP04, CP05, CP06 y CP08 | Clases inválidas de los campos: vacío, solo espacios y archivo de tipo no permitido |
| Clases de equivalencia | CP01 y CP07 | Clase válida del listado y clase de archivos que ofrece el selector |
| Valores límite | CP09 | El tamaño mínimo válido es 1 byte: se prueba el límite inválido, 0 bytes |
| Tablas de decisión | CP02, CP03 y CP04 | Combinaciones de título, descripción y archivo en las que falta exactamente uno |

## Casos descartados

Estos casos no se pueden implementar sin modificar `backend/`, así que se
descartan según la regla del lab.

**Causa:** `backend/src/recurso/RecursoRepository.js` ejecuta
`INSERT INTO recursos (titulo, tipo, tamaño, ruta)`, pero la tabla `recursos`
tiene las columnas `titulo`, `descripcion`, `tipo`, `archivo`,
`fecha_publicacion`, `id_curso` e `id_usuario`. Toda subida válida responde
`400 Unknown column 'tamaño' in 'field list'`.

| Caso descartado | Valores de Prueba | Resultado Esperado una vez corregido | Técnica |
|---|---|---|---|
| Subir un PDF válido y verlo en la lista | `fixtures/prueba.pdf` con título único | El recurso aparece en la lista como tipo PDF | Clases de equivalencia |
| El enlace `Ver Recurso` entrega el archivo | Recurso recién subido | `200`, `application/pdf` y contenido que empieza por `%PDF-` | Clases de equivalencia |
| Título en el límite de la columna | 200 caracteres | Se acepta | Valores límite |
| Título sobre el límite de la columna | 201 caracteres | Alert `Error al subir recurso`; no se guarda | Valores límite |
| Descripción en el límite de la columna | 500 caracteres | Se acepta | Valores límite |
| Descripción sobre el límite de la columna | 501 caracteres | Alert `Error al subir recurso`; no se guarda | Valores límite |

Los casos de 201 y 501 caracteres hoy pasarían, pero por la columna inexistente
y no por la longitud, así que no probarían nada.

**Lista vacía:** tampoco se automatiza, porque exige vaciar la tabla `recursos`
compartida.
