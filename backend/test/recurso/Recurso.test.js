const Recurso = require('../../src/recurso/model/Recurso');

describe('Entidad de Dominio: Recurso', () => {
    let datosValidos;
    // la creacion/config va aca en vez de en cada arrange para cada caso 
    beforeEach(() => {
        datosValidos = {
            titulo: 'Apuntes de BD',
            tipo: 'pdf',
            tamaño: 1024,
            ruta: '/uploads/apuntes.pdf'
        };
    });

    test('debe crear un recurso válido cuando se cumplen todos los invariantes', () => {
        // Arrange
        const tituloEsperado = 'Apuntes de BD';

        // Act
        const resultado = new Recurso(
            datosValidos.titulo, 
            datosValidos.tipo, 
            datosValidos.tamaño, 
            datosValidos.ruta
        );

        // Assert
        expect(resultado.titulo).toEqual(tituloEsperado);
        expect(resultado.tipo).toEqual('pdf');
    });

    test('debe lanzar error cuando el título está vacío', () => {
        datosValidos.titulo = '   '; // Dato inválido
        const esperado = 'El título no puede estar vacío';

        const creacionInvalida = () => {
            new Recurso(datosValidos.titulo, datosValidos.tipo, datosValidos.tamaño, datosValidos.ruta);
        };

        expect(creacionInvalida).toThrow(esperado);
    });

    test('debe lanzar error cuando el tipo no está permitido', () => {
        datosValidos.tipo = 'exe'; // Dato inválido
        const esperado = 'Tipo de recurso no permitido';

        const creacionInvalida = () => {
            new Recurso(datosValidos.titulo, datosValidos.tipo, datosValidos.tamaño, datosValidos.ruta);
        };

        expect(creacionInvalida).toThrow(esperado);
    });

    test('debe lanzar error cuando el tamaño es 0 o menor', () => {
        // Dato inválido
        datosValidos.tamaño = 0;
        const esperado = 'El tamaño del archivo debe ser mayor a cero';

        const creacionInvalida = () => {
            new Recurso(datosValidos.titulo, datosValidos.tipo, datosValidos.tamaño, datosValidos.ruta);
        };

        expect(creacionInvalida).toThrow(esperado);
    });
});