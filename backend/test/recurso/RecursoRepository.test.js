const RecursoRepository = require('../../src/recurso/RecursoRepository');
const Recurso = require('../../src/recurso/model/Recurso');

describe('Repositorio: RecursoRepository', () => {
    let mockDb;
    let repositorio;

    beforeEach(() => {
        mockDb = {
            query: jest.fn()
        };
        repositorio = new RecursoRepository(mockDb);
    });

    test('debe devolver la lista de recursos al buscar existentes', async () => {
        // // Arrange
        const filasEsperadas = [
            { id: 1, titulo: 'Apuntes BD', id_curso: 1, id_usuario: 2, url: '/uploads/apuntes.pdf' }
        ];
        mockDb.query.mockResolvedValue([filasEsperadas]);

        // // Act
        const resultado = await repositorio.findAll();

        // // Assert
        expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM recursos');
        expect(resultado).toEqual(filasEsperadas);
    });

    test('debe devolver un arreglo vacío cuando no hay recursos', async () => {
        // // Arrange
        mockDb.query.mockResolvedValue([[]]);

        // // Act
        const resultado = await repositorio.findAll();

        // // Assert
        expect(resultado).toEqual([]);
    });

    test('debe ejecutar la consulta SQL insertando id_curso e id_usuario correctamente', async () => {
        // // Arrange
        const insertResult = { insertId: 5, affectedRows: 1 };
        mockDb.query.mockResolvedValue([insertResult]);

        const nuevoRecurso = new Recurso({
            titulo: 'Guía de Refactoring',
            descripcion: 'Material de estudio TDD',
            id_curso: 10,
            id_usuario: 5,
            url: '/uploads/guia.pdf'
        });

        // // Act
        const resultado = await repositorio.save(nuevoRecurso);

        // // Assert
        expect(mockDb.query).toHaveBeenCalledWith(
            expect.stringMatching(/INSERT INTO recursos.*id_curso.*id_usuario/i),
            expect.arrayContaining([
                nuevoRecurso.titulo,
                nuevoRecurso.descripcion,
                nuevoRecurso.id_curso,
                nuevoRecurso.id_usuario,
                nuevoRecurso.url
            ])
        );
        expect(resultado).toEqual(insertResult);
    });
});