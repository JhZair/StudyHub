class Recurso {
    constructor({ id = null, titulo, descripcion = '', id_curso, id_usuario, url = '', fecha_creacion = null }) {
        if (!titulo || titulo.trim() === '') {
            throw new Error('El título no puede estar vacío');
        }

        if (!id_curso) {
            throw new Error('El id_curso es obligatorio');
        }

        if (!id_usuario) {
            throw new Error('El id_usuario es obligatorio');
        }

        this.id = id;
        this.titulo = titulo.trim();
        this.descripcion = descripcion ? descripcion.trim() : '';
        this.id_curso = Number(id_curso);
        this.id_usuario = Number(id_usuario);
        this.url = url;
        this.fecha_creacion = fecha_creacion;
    }
}

module.exports = Recurso;