class Recurso {
    constructor(titulo, tipo, tamaño, ruta) {
        if (!titulo || titulo.trim() === '') {
            throw new Error('El título no puede estar vacío');
        }
        
        const tiposPermitidos = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
        if (!tipo || !tiposPermitidos.includes(tipo.toLowerCase())) {
            throw new Error('Tipo de recurso no permitido');
        }
        
        if (tamaño <= 0) {
            throw new Error('El tamaño del archivo debe ser mayor a cero');
        }

        this.titulo = titulo.trim();
        this.tipo = tipo.toLowerCase();
        this.tamaño = tamaño;
        this.ruta = ruta;
    }
}

module.exports = Recurso;