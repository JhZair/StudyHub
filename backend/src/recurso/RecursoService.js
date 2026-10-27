const Recurso = require('./model/Recurso');

class RecursoService {
    constructor(recursoRepository) {
        this.recursoRepository = recursoRepository;
    }

    async obtenerTodos() {
        return await this.recursoRepository.findAll();
    }

    async subirRecurso(datosFormulario, datosArchivo) {
        const tipoArchivo = datosArchivo.originalname.split('.').pop();
        
        const nuevoRecurso = new Recurso(
            datosFormulario.titulo, 
            tipoArchivo, 
            datosArchivo.size, 
            datosArchivo.path
        );

        return await this.recursoRepository.save(nuevoRecurso);
    }
}

module.exports = RecursoService;