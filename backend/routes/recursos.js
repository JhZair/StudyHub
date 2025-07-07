const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento local para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Subir recurso con archivo local
router.post('/upload', upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const archivoUrl = `/uploads/${req.file.filename}`; // URL relativa

    const nuevoRecurso = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      archivo: archivoUrl,
      tipo: 'PDF',
      id_curso: req.body.id_curso,
      id_usuario: req.body.id_usuario,
      fecha_publicacion: new Date()
    };

    await req.db.query(
      'INSERT INTO recursos (titulo, descripcion, archivo, tipo, id_curso, id_usuario, fecha_publicacion) VALUES (?,?,?,?,?,?,?)',
      [
        nuevoRecurso.titulo,
        nuevoRecurso.descripcion,
        nuevoRecurso.archivo,
        nuevoRecurso.tipo,
        nuevoRecurso.id_curso,
        nuevoRecurso.id_usuario,
        nuevoRecurso.fecha_publicacion
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al guardar recurso en la base de datos' });
        }
        res.json({ mensaje: 'Recurso subido correctamente', recurso: nuevoRecurso });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al subir recurso' });
  }
});

// Obtener todos los recursos
router.get('/', (req, res) => {
  req.db.query('SELECT * FROM recursos', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Agregar recurso sin archivo
router.post('/', (req, res) => {
  const { titulo, descripcion, tipo, archivo, id_curso, id_usuario } = req.body;
  req.db.query(
    'INSERT INTO recursos (titulo, descripcion, tipo, archivo, id_curso, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
    [titulo, descripcion, tipo, archivo, id_curso, id_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, titulo });
    }
  );
});

module.exports = router;
