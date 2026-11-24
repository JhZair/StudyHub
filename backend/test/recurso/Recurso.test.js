const Recurso = require('../../src/recurso/model/Recurso');

describe('Entidad de Dominio: Recurso', () => {
    test('debe crear un recurso válido cuando se cumplen todos los invariantes', () => {
        const recurso = new Recurso({
            titulo: 'Ejemplo de Documento',
            descripcion: 'Un resumen del tema',
            id_curso: 1,
            id_usuario: 2,
            url: '/uploads/doc.pdf'
        });

        expect(recurso.titulo).toBe('Ejemplo de Documento');
        expect(recurso.id_curso).toBe(1);
        expect(recurso.id_usuario).toBe(2);
    });

    test('debe lanzar error cuando el título está vacío', () => {
        expect(() => {
            new Recurso({ titulo: '', id_curso: 1, id_usuario: 1 });
        }).toThrow('El título no puede estar vacío');
    });

    test('debe lanzar error cuando falta el id_curso', () => {
        expect(() => {
            new Recurso({ titulo: 'Prueba sin curso', id_usuario: 1 });
        }).toThrow('El id_curso es obligatorio');
    });

    test('debe lanzar error cuando falta el id_usuario', () => {
        expect(() => {
            new Recurso({ titulo: 'Prueba sin usuario', id_curso: 1 });
        }).toThrow('El id_usuario es obligatorio');
    });
});