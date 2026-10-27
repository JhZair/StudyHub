const express = require('express');
const router = express.Router();
const multer = require('multer');

const RecursoRepository = require('./RecursoRepository');
const RecursoService = require('./RecursoService');

// Configuración de almacenamiento local para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const inicializarServicio = (req) => {
  const repository = new RecursoRepository(req.db);
  return new RecursoService(repository);
};

router.post('/upload', upload.single('archivo'), async (req, res) => {
  try {
    const servicio = inicializarServicio(req);
    await servicio.subirRecurso(req.body, req.file);
    res.json({ success: true, mensaje: 'Recurso subido correctamente' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Error al subir recurso' });
  }
});

router.get('/', async (req, res) => {
  try {
    const servicio = inicializarServicio(req);
    const rows = await servicio.obtenerTodos();
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener recursos:', err);
    res.status(500).json({ error: 'Error interno al obtener recursos' });
  }
});

module.exports = router;