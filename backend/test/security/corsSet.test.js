describe('Configuración de CORS y Orígenes Permitidos', () => {
    const allowedOrigins = new Set([
        'http://localhost:5173',
        'https://studyhubfrontend-5pmm.onrender.com'
    ]);

    test('debe permitir orígenes válidos registrados en el Set', () => {
        // // Arrange
        const originValido = 'http://localhost:5173';

        // // Act & Assert
        expect(allowedOrigins.has(originValido)).toBe(true);
    });

    test('debe rechazar orígenes no registrados', () => {
        // // Arrange
        const originInvalido = 'http://sitio-malicioso.com';

        // // Act & Assert
        expect(allowedOrigins.has(originInvalido)).toBe(false);
    });
});