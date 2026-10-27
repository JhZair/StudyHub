# Casos de prueba — Módulo usuario

Pruebas unitarias con Jest en `backend/test/usuario/`, escritas con el
patrón AAA (Arrange / Act / Assert). En todos los archivos
`src/config/database.js` se reemplaza con `jest.mock`, así que ninguna
prueba abre una conexión a MySQL.

Ejecutar desde `backend/`:

```
npm test
npm run coverage
```

## test/usuario/Usuario.test.js

Entidad de dominio: el constructor valida los invariantes y lanza `Error`.

| Clase/Metodo | Caso de Prueba | Valores de Prueba | Resultado Esperado |
|---|---|---|---|
| Usuario / constructor | Usuario válido con todos sus campos | `id_usuario: 1`, `nombre: '  Ana García  '`, `email: 'ana.garcia@example.com'`, `password: 'secreta123'`, `universidad: 'Universidad Nacional'`, `fecha_registro: 2023-01-15`, `ultimo_acceso: 2023-06-20` | Se crea la instancia con `nombre` recortado a `'Ana García'` y el resto de campos sin cambios |
| Usuario / constructor | `fecha_registro` toma la fecha actual cuando no viene | Datos válidos sin `fecha_registro`, `ultimo_acceso: null`; reloj fijado con `jest.useFakeTimers` en 2026-10-27 12:00 UTC | `usuario.fecha_registro` es igual a la fecha fijada |
| Usuario / constructor | `id_usuario` no es entero positivo | `id_usuario: 0` | Error `id_usuario debe ser un entero positivo` |
| Usuario / constructor | Nombre vacío tras trim | `nombre: '   '` | Error `El nombre es obligatorio` |
| Usuario / constructor | Nombre de más de 100 caracteres | `nombre: 'a' × 101` | Error `El nombre no puede superar 100 caracteres` |
| Usuario / constructor | Email vacío | `email: ''` | Error `El email es obligatorio` |
| Usuario / constructor | Email con formato inválido | `email: 'ana.example.com'` | Error `El email no tiene un formato valido` |
| Usuario / constructor | Email de más de 100 caracteres | `email: 'a' × 90 + '@example.com'` (102 caracteres) | Error `El email no puede superar 100 caracteres` |
| Usuario / constructor | Password vacía | `password: ''` | Error `La password es obligatoria` |
| Usuario / constructor | Password de más de 100 caracteres | `password: 'x' × 101` | Error `La password no puede superar 100 caracteres` |
| Usuario / constructor | Universidad vacía cuando viene | `universidad: '   '` | Error `La universidad no puede estar vacia` |
| Usuario / constructor | Universidad de más de 100 caracteres | `universidad: 'u' × 101` | Error `La universidad no puede superar 100 caracteres` |
| Usuario / constructor | `fecha_registro` inválida | `fecha_registro: new Date('no-es-fecha')` | Error `fecha_registro debe ser una fecha valida` |
| Usuario / constructor | `ultimo_acceso` inválido | `ultimo_acceso: '2023-06-20'` (string, no `Date`) | Error `ultimo_acceso debe ser una fecha valida` |
| Usuario / constructor | `ultimo_acceso` anterior a `fecha_registro` | `fecha_registro: 2023-06-20`, `ultimo_acceso: 2023-01-15` | Error `ultimo_acceso no puede ser anterior a fecha_registro` |

## test/usuario/UsuarioRepository.test.js

Implementación con mysql2. `db.query` es un `jest.fn()` que devuelve
`[filas, campos]`, igual que `mysql2/promise`.

| Clase/Metodo | Caso de Prueba | Valores de Prueba | Resultado Esperado |
|---|---|---|---|
| UsuarioRepository / findByEmail | Email existente | `'ana.garcia@example.com'`; `db.query` devuelve `[[filaAna], []]` | Ejecuta `SELECT * FROM usuario WHERE email = ?` con `['ana.garcia@example.com']` y devuelve una instancia de `Usuario` con los datos de la fila |
| UsuarioRepository / findByEmail | Email inexistente | `'nadie@example.com'`; `db.query` devuelve `[[], []]` | Devuelve `null` |
| UsuarioRepository / findById | Id existente | `1`; `db.query` devuelve `[[filaAna], []]` | Ejecuta `SELECT * FROM usuario WHERE id_usuario = ?` con `[1]` y devuelve una instancia de `Usuario` con los datos de la fila |
| UsuarioRepository / findById | Id inexistente | `999`; `db.query` devuelve `[[], []]` | Devuelve `null` |
| UsuarioRepository / save | Inserta un usuario nuevo | `Usuario` sin id (`leo@example.com`, password hasheada); `db.query` devuelve `[{ insertId: 7 }]` | Ejecuta el `INSERT` con los 6 campos en orden y devuelve un `Usuario` con `id_usuario: 7` |
| UsuarioRepository / findAll | Lista todos los usuarios | `db.query` devuelve las filas de Ana y Carlos | Ejecuta `SELECT * FROM usuario` y devuelve 2 instancias de `Usuario` con sus emails en orden |
| UsuarioRepository / save | MySQL responde `ER_DUP_ENTRY` | `db.query` rechaza con `{ code: 'ER_DUP_ENTRY' }` | Rechaza con un error de negocio `{ codigo: 'EMAIL_DUPLICADO', message: 'Correo ya registrado' }` |
| UsuarioRepository / save | Error de MySQL distinto de `ER_DUP_ENTRY` | `db.query` rechaza con `{ code: 'PROTOCOL_CONNECTION_LOST' }` | Rechaza con el mismo error original, sin campo `codigo` |

## test/usuario/UsuarioService.test.js

Lógica de aplicación. El repositorio es un doble de `IUsuarioRepository`
con cada método reemplazado por un `jest.fn()`. bcrypt es el real.

| Clase/Metodo | Caso de Prueba | Valores de Prueba | Resultado Esperado |
|---|---|---|---|
| UsuarioService / registrar | Email ya registrado | `findByEmail` devuelve un `Usuario` existente; datos de registro de `leo@example.com` | Rechaza con `codigo: 'EMAIL_DUPLICADO'`; no llama a `save` |
| UsuarioService / registrar | Sin universidad | `universidad: undefined` | Rechaza con `codigo: 'VALIDACION'`, mensaje `Faltan campos`; no consulta ni guarda |
| UsuarioService / registrar | Password de 7 caracteres | `password: 'abc1234'` | Rechaza con `codigo: 'VALIDACION'`, mensaje `La password debe tener al menos 8 caracteres`; no llama a `save` |
| UsuarioService / registrar | Email mal formado (lo rechaza la entidad) | `email: 'leo.example.com'` | Rechaza con `codigo: 'VALIDACION'`, mensaje `El email no tiene un formato valido`; no consulta ni guarda |
| UsuarioService / registrar | Datos válidos | `nombre: 'Leo Ramos'`, `email: 'leo@example.com'`, `password: 'secreta123'`, `universidad: 'UCSP'`; `findByEmail` devuelve `null` | `save` recibe un `Usuario` con password distinta de `'secreta123'`, con formato `$2b$10$…` y que `bcrypt.compare` valida; el resultado no tiene `password` |
| UsuarioService / login | Sin email | `{ password: 'secreta123' }` | Rechaza con `codigo: 'VALIDACION'`, mensaje `Faltan campos`; no consulta el repositorio |
| UsuarioService / login | Sin password | `{ email: 'leo@example.com' }` | Rechaza con `codigo: 'VALIDACION'`, mensaje `Faltan campos`; no consulta el repositorio |
| UsuarioService / login | Password incorrecta | `findByEmail` devuelve el usuario con hash de `'secreta123'`; `password: 'incorrecta1'` | Rechaza con `codigo: 'CREDENCIALES_INVALIDAS'` |
| UsuarioService / login | Usuario inexistente | `findByEmail` devuelve `null`; `email: 'nadie@example.com'` | Rechaza con `codigo: 'CREDENCIALES_INVALIDAS'` |
| UsuarioService / login | Credenciales correctas | `findByEmail` devuelve el usuario con hash de `'secreta123'`; `password: 'secreta123'` | Devuelve el usuario (`id_usuario: 1`, `nombre`, `email`) sin el campo `password` |
| UsuarioService / listar | El resultado no expone passwords | `findAll` devuelve 2 instancias de `Usuario` con password hasheada | Devuelve 2 objetos, ninguno con propiedad `password` |

## test/usuario/IUsuarioRepository.test.js

Interfaz como clase abstracta: ningún método tiene implementación.

| Clase/Metodo | Caso de Prueba | Valores de Prueba | Resultado Esperado |
|---|---|---|---|
| IUsuarioRepository / findByEmail | Método sin implementar | `'ana.garcia@example.com'` | Rechaza con `Error('No implementado')` |
| IUsuarioRepository / findById | Método sin implementar | `1` | Rechaza con `Error('No implementado')` |
| IUsuarioRepository / findAll | Método sin implementar | (sin argumentos) | Rechaza con `Error('No implementado')` |
| IUsuarioRepository / save | Método sin implementar | `{}` | Rechaza con `Error('No implementado')` |
