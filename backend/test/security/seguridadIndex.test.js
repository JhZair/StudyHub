const request = require('supertest');
const express = require('express');

describe('Seguridad y Configuración en Express', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.disable('x-powered-by');
        app.get('/test', (req, res) => res.send('OK'));
    });

    test('debe haber deshabilitado la cabecera X-Powered-By', async () => {
        // // Arrange & Act
        const response = await request(app).get('/test');

        // // Assert
        expect(response.headers['x-powered-by']).toBeUndefined();
    });
});