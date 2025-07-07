const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const [rows] = await req.db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = rows[0];
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Guardar sesión
    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };

    res.json({ mensaje: 'Login exitoso', usuario: req.session.usuario });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const [existing] = await req.db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await req.db.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)', [nombre, correo, hashedPassword]);

    res.json({ mensaje: 'Registro exitoso' });

  } catch (err) {
    console.error('Error en signup:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ mensaje: 'Sesión cerrada' });
});

module.exports = router;
