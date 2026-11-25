const crearRecursoRouter = require('../../src/recurso/RecursoController');

describe('RecursoController', () => {
    let mockService;

    beforeEach(() => {
        mockService = {
            obtenerTodos: jest.fn(),
            subirRecurso: jest.fn()
        };
    });

    test('debe retornar la función fábrica router correctamente', () => {
        const router = crearRecursoRouter(mockService);
        expect(router).toBeDefined();
        expect(typeof router).toBe('function');
    });

    test('GET / debe invocar obtenerTodos del servicio', async () => {
        const router = crearRecursoRouter(mockService);
        mockService.obtenerTodos.mockResolvedValue([]);

        const req = {};
        const res = { json: jest.fn() };
        const next = jest.fn();

        // Buscar el handler registrado en GET /
        const routeHandler = router.stack.find(layer => layer.route && layer.route.path === '/').route.stack[0].handle;
        await routeHandler(req, res, next);

        expect(mockService.obtenerTodos).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith([]);
    });
});