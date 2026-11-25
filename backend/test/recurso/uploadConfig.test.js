const uploadConfig = require('../../src/recurso/uploadConfig');

describe('Configuración de Multer: uploadConfig', () => {
    test('fileFilter debe aceptar archivos permitidos (pdf, docx, png, jpg)', () => {
        // Arrange
        const fileMock = { originalname: 'documento.pdf', mimetype: 'application/pdf' };
        const cb = jest.fn();

        // Act
        uploadConfig.fileFilter({}, fileMock, cb);

        // Assert
        expect(cb).toHaveBeenCalledWith(null, true);
    });

    test('fileFilter debe rechazar archivos no permitidos (ej. exe, sh, html)', () => {
        // Arrange
        const fileMock = { originalname: 'malware.exe', mimetype: 'application/x-msdownload' };
        const cb = jest.fn();

        // Act
        uploadConfig.fileFilter({}, fileMock, cb);

        // Assert
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
        expect(cb.mock.calls[0][0].message).toContain('Tipo de archivo no permitido');
    });

    test('debe generar un nombre seguro sin usar originalname directo', () => {
        // Arrange
        const fileMock = { originalname: 'archivo con espacios y %20.pdf' };
        const cb = jest.fn();

        // Act - Invocamos directamente el generador de nombre (getFilename / filename)
        uploadConfig.storage.getFilename({}, fileMock, cb);

        // Assert
        expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/^\d+-\d+\.pdf$/));
    });
});