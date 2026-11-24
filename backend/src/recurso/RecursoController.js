const express = require('express');
const multer = require('multer');
const uploadConfig = require('./uploadConfig');

// Configuración de almacenamiento local para multer (o import desde uploadConfig)
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

function crearRecursoRouter(recursoService) {
    const router = express.Router();

    // GET /api/recursos - Listar recursos
    router.get('/', async (req, res, next) => {
        try {
            const recursos = await recursoService.obtenerTodos();
            res.json(recursos);
        } catch (error) {
            next(error);
        }
    });

    // POST /api/recursos - Subir un recurso
    router.post('/', uploadConfig.single('archivo'), async (req, res, next) => {
        try {
            const nuevoRecurso = await recursoService.subirRecurso(req.body, req.file);
            res.status(201).json(nuevoRecurso);
        } catch (error) {
            next(error);
        }
    });

    return router;
}

module.exports = crearRecursoRouter;