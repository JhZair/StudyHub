const multer = require('multer');
const path = require('path');

// 1. Configuración de almacenamiento con nombre seguro
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const nombreSeguro = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, nombreSeguro);
    }
});

// 2. Filtro de tipo de archivo (fileFilter)
const fileFilter = (req, file, cb) => {
    const extensionesPermitidas = /pdf|doc|docx|png|jpg|jpeg/;
    const extName = extensionesPermitidas.test(path.extname(file.originalname).toLowerCase());
    const mimeType = extensionesPermitidas.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    }
    const error = new Error('Tipo de archivo no permitido. Solo se aceptan PDF, DOC, DOCX, PNG o JPG.');
    error.codigo = 'VALIDACION';
    cb(error);
};

// 3. Instancia de multer con límite de tamaño (10 MB)
const uploadConfig = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter
});

module.exports = uploadConfig;