const SimulacroService = require('../../src/simulacro/SimulacroService');

describe('Modulo Simulacro - Puntajes', () => {
    let mockRepository;
    let servicio;

    beforeEach(() => {
        mockRepository = {
            guardarPuntaje: jest.fn(),
            obtenerPuntajesPorUsuario: jest.fn()
        };
        servicio = new SimulacroService(mockRepository);
    });

    test('debe guardar el puntaje correctamente', async () => {
        // // Arrange
        const datos = { id_usuario: 1, id_simulacro: 2, puntaje: 85 };
        mockRepository.guardarPuntaje.mockResolvedValue({ insertId: 10 });

        // // Act
        const resultado = await servicio.guardarPuntaje(datos);

        // // Assert
        expect(mockRepository.guardarPuntaje).toHaveBeenCalled();
        expect(resultado).toEqual({ insertId: 10 });
    });

    test('debe obtener los puntajes de un usuario', async () => {
        // // Arrange
        const listaMock = [{ id: 1, id_usuario: 1, puntaje: 90 }];
        mockRepository.obtenerPuntajesPorUsuario.mockResolvedValue(listaMock);

        // // Act
        const resultado = await servicio.obtenerPuntajesPorUsuario(1);

        // // Assert
        expect(resultado).toEqual(listaMock);
    });
});