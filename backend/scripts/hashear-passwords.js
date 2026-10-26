// Migra a bcrypt las passwords de usuario que siguen en texto plano.
// Es idempotente: las que ya son hash bcrypt se saltan, asi que puede
// correrse varias veces sin dañar nada.
// Uso (desde backend/): npm run migrar:passwords
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

const SALT_ROUNDS = 10;
const BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

async function main() {
  const [usuarios] = await db.query('SELECT id_usuario, email, password FROM usuario');

  let actualizadas = 0;
  let saltadas = 0;

  for (const { id_usuario, email, password } of usuarios) {
    if (BCRYPT_REGEX.test(password)) {
      saltadas++;
      continue;
    }
    if (!password) {
      console.warn(`Usuario ${id_usuario} (${email}) tiene la password vacia; se salta`);
      saltadas++;
      continue;
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // La condicion sobre password evita pisar un cambio hecho mientras corre el script
    const [result] = await db.query(
      'UPDATE usuario SET password = ? WHERE id_usuario = ? AND password = ?',
      [hash, id_usuario, password]
    );
    if (result.affectedRows === 1) {
      actualizadas++;
    } else {
      saltadas++;
    }
  }

  console.log(`Passwords actualizadas: ${actualizadas}`);
  console.log(`Passwords saltadas: ${saltadas}`);
}

main()
  .catch((err) => {
    console.error('Error en la migracion:', err);
    process.exitCode = 1;
  })
  .finally(() => db.end());
