const RecursoService = require('../../src/recurso/RecursoService');

describe('Servicio de Aplicación: RecursoService', () => {
    let mockRepository;
    let servicio;

    // Configuración inicial
    beforeEach(() => {
        // Mock de la interfaz IRecursoRepository usando jest.fn()
        mockRepository = {
            findAll: jest.fn(),
            save: jest.fn()
        };
        // Inyectamos el repositorio mockeado al servicio
        servicio = new RecursoService(mockRepository);
    });

    test('debe listar todos los recursos llamando al repositorio', async () => {
        // Arrange
        const recursosEsperados = [{ id: 1, titulo: 'Guía', tipo: 'pdf' }];
        mockRepository.findAll.mockResolvedValue(recursosEsperados);

        // Act
        const resultado = await servicio.obtenerTodos();

        // Assert
        expect(mockRepository.findAll).toHaveBeenCalled();
        expect(resultado).toEqual(recursosEsperados);
    });

    test('debe subir un recurso válido correctamente', async () => {
        // Arrange
        const datosFormulario = { titulo: 'Proyecto final' };
        const datosArchivo = { originalname: 'proyecto.pdf', size: 2048, path: '/uploads/proyecto.pdf' };
        const respuestaGuardado = { insertId: 5 };
        
        mockRepository.save.mockResolvedValue(respuestaGuardado);

        // Act
        const resultado = await servicio.subirRecurso(datosFormulario, datosArchivo);

        // Assert
        expect(mockRepository.save).toHaveBeenCalled();
        expect(resultado).toEqual(respuestaGuardado);
    });

    test('debe fallar si se rompe un invariante de dominio y NO llamar al repositorio', async () => {
        // Arrange
        const datosFormulario = { titulo: '   ' }; // Título vacío (invariante inválido)
        const datosArchivo = { originalname: 'proyecto.pdf', size: 2048, path: '/uploads/proyecto.pdf' };
        const mensajeEsperado = 'El título no puede estar vacío';

        // Act & Assert
        // Verificamos que la promesa sea rechazada con el error del dominio
        await expect(servicio.subirRecurso(datosFormulario, datosArchivo)).rejects.toThrow(mensajeEsperado);
        
        // Verificamos que la BD no fue tocada
        expect(mockRepository.save).not.toHaveBeenCalled();
    });
});