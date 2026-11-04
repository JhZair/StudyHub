# Casos funcionales — Registro de usuario

Pruebas de caja negra con Selenium WebDriver y Jest en
`e2e/tests/registro.test.js`. Corren contra la app en local: frontend
`http://localhost:5173`, backend `http://localhost:3000`.

Ejecutar desde `e2e/`:

```
npx jest tests/registro.test.js --runInBand --verbose
```

## Casos de prueba

| Objeto de Prueba / Funcionalidad | Escenario/Acciones | Valores de Prueba | Resultado Esperado |
|---|---|---|---|
| CP01 — Registro de usuario | Llenar el formulario con datos válidos y enviar | Nombre `Ana García`; email único con timestamp; contraseña y confirmación `claveSegura1` | Alert `Registro exitoso. Ahora inicia sesión.`; al aceptarlo, redirige a `/login` |
| CP02 — Registro de usuario | Registrar el email por la API; luego enviar el formulario con ese mismo email | Email único con timestamp, ya registrado; contraseña y confirmación `claveSegura1` | Mensaje `Correo ya registrado`; sigue en `/signup` |
| CP03 — Registro de usuario | Llenar el formulario con un email sin `@` y enviar | Email `ana.example.com`; contraseña y confirmación `claveSegura1` | El navegador bloquea el envío: `validity.typeMismatch` en el email; no se llama al backend; sigue en `/signup` |
| CP04 — Registro de usuario | Llenar el formulario con una contraseña de 7 caracteres y enviar | Contraseña y confirmación `clave12` | Mensaje `La password debe tener al menos 8 caracteres`; sigue en `/signup` |
| CP05 — Registro de usuario | Llenar el formulario con una contraseña de 8 caracteres y enviar | Contraseña y confirmación `clave123`; email único con timestamp | Alert `Registro exitoso. Ahora inicia sesión.`; al aceptarlo, redirige a `/login` |
| CP06 — Registro de usuario | Llenar el formulario con contraseña y confirmación distintas y enviar | Contraseña `claveSegura1`; confirmación `claveSegura2` | Mensaje `Las contraseñas no coinciden`; no se llama al backend; sigue en `/signup` |
| CP07 — Registro de usuario | Enviar el formulario sin llenar ningún campo | Todos los campos vacíos | El navegador bloquea el envío: `validity.valueMissing` en el nombre; no se llama al backend; sigue en `/signup` |
| CP08 — Registro de usuario | Llenar el formulario con un email sin dominio de nivel superior y enviar | Email `ana@example`; contraseña y confirmación `claveSegura1` | El navegador deja pasar el email y el backend lo rechaza: mensaje `El email no tiene un formato valido`; sigue en `/signup` |

## Técnicas de caja negra

| Técnica | Casos | Justificación |
|---|---|---|
| Clases de equivalencia | CP01 (clase válida); CP03, CP07 y CP08 (clases inválidas de email y de campos obligatorios) | `ana.example.com` es inválido para el navegador; `ana@example` es válido para el navegador e inválido para el backend |
| Valores límite | CP04 y CP05 | La longitud mínima de la contraseña es 8: se prueban 7 (rechazada) y 8 (aceptada) |
| Tablas de decisión | CP02 y CP06 | CP02: email con formato válido × email ya registrado. CP06: contraseñas válidas × confirmación distinta |

## Caso descartado

**Universidad vacía: no ejecutable por la interfaz.** El formulario no tiene
campo de universidad y `src/pages/Signup.jsx` envía siempre
`universidad: 'ucsp'`. La regla se cubre con la prueba unitaria "sin
universidad" de `backend/test/usuario/UsuarioService.test.js`.
