const Recurso = require('./model/Recurso');

class RecursoService {
    constructor(recursoRepository) {
        this.recursoRepository = recursoRepository;
    }

    async obtenerTodos() {
        return await this.recursoRepository.findAll();
    }

    async subirRecurso(datosFormulario, datosArchivo) {
        if (datosArchivo && datosArchivo.size === 0) {
            const error = new Error('El tamaño del archivo debe ser mayor a cero');
            error.codigo = 'VALIDACION';
            throw error;
        }

        const url = datosArchivo ? (datosArchivo.filename ? `/uploads/${datosArchivo.filename}` : datosArchivo.path) : '';
        
        const recurso = new Recurso({
            titulo: datosFormulario.titulo,
            descripcion: datosFormulario.descripcion || '',
            id_curso: datosFormulario.id_curso,
            id_usuario: datosFormulario.id_usuario,
            url: url
        });

        return await this.recursoRepository.save(recurso);
    }
}

module.exports = RecursoService;