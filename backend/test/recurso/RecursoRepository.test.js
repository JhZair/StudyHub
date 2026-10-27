const RecursoRepository = require('../../src/recurso/RecursoRepository');

describe('Repositorio: RecursoRepository', () => {
    let mockDb;
    let repositorio;

    // Configuración inicial antes de cada caso de prueba
    beforeEach(() => {
        // Mockeamos el pool de mysql2
        mockDb = {
            query: jest.fn()
        };
        repositorio = new RecursoRepository(mockDb);
    });

    test('debe devolver la lista de recursos al buscar existentes', async () => {
        // Arrange
        const filasEsperadas = [
            { id: 1, titulo: 'Apuntes BD', tipo: 'pdf' },
            { id: 2, titulo: 'Diapositivas', tipo: 'ppt' }
        ];
        // Simulamos que la BD devuelve esas filas
        mockDb.query.mockResolvedValue([filasEsperadas]);

        // Act
        const resultado = await repositorio.findAll();

        // Assert
        expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM recursos');
        expect(resultado).toEqual(filasEsperadas);
    });

    test('debe devolver un arreglo vacío cuando no hay recursos', async () => {
        // Arrange
        mockDb.query.mockResolvedValue([[]]);

        // Act
        const resultado = await repositorio.findAll();

        // Assert
        expect(resultado).toEqual([]);
    });

    test('debe guardar un recurso correctamente', async () => {
        // Arrange
        const nuevoRecurso = {
            titulo: 'Nuevo PDF',
            tipo: 'pdf',
            tamaño: 2048,
            ruta: '/uploads/nuevo.pdf'
        };
        const insertResult = { insertId: 5, affectedRows: 1 };
        mockDb.query.mockResolvedValue([insertResult]);

        // Act
        const resultado = await repositorio.save(nuevoRecurso);

        // Assert
        expect(mockDb.query).toHaveBeenCalledWith(
            'INSERT INTO recursos (titulo, tipo, tamaño, ruta) VALUES (?, ?, ?, ?)',
            [nuevoRecurso.titulo, nuevoRecurso.tipo, nuevoRecurso.tamaño, nuevoRecurso.ruta]
        );
        expect(resultado).toEqual(insertResult);
    });
});