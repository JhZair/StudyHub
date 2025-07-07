const express = require('express');
const router = express.Router();

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const sql = 'SELECT id_usuario, nombre, email, fecha_registro, ultimo_acceso, universidad FROM usuario WHERE email = ? AND password = ?';

  req.db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error al consultar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    req.session.usuario = results[0];
    res.json({ mensaje: 'Login exitoso', usuario: results[0] });
  });
});

// REGISTRO
router.post('/signup', (req, res) => {
  const { nombre, email, password, universidad } = req.body;

  if (!nombre || !email || !password || !universidad) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const checkSql = 'SELECT * FROM usuario WHERE email = ?';

  req.db.query(checkSql, [email], (err, existing) => {
    if (err) {
      console.error('Error al consultar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    const insertSql = 'INSERT INTO usuario (nombre, email, password, universidad, fecha_registro, ultimo_acceso) VALUES (?, ?, ?, ?, NOW(), NOW())';

    req.db.query(insertSql, [nombre, email, password, universidad], (err, result) => {
      if (err) {
        console.error('Error al insertar:', err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }

      res.json({ mensaje: 'Registro exitoso' });
    });
  });
});

// PERFIL
router.get('/perfil', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  res.json({ usuario: req.session.usuario });
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ mensaje: 'Sesión cerrada' });
  });
});

module.exports = router;
