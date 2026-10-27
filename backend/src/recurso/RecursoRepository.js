const IRecursoRepository = require('./model/IRecursoRepository');

class RecursoRepository extends IRecursoRepository {
    constructor(db) {
        super();
        this.db = db; 
    }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM recursos');
        return rows;
    }

    async save(recurso) {
        const query = 'INSERT INTO recursos (titulo, tipo, tamaño, ruta) VALUES (?, ?, ?, ?)';
        const [result] = await this.db.query(query, [
            recurso.titulo, 
            recurso.tipo, 
            recurso.tamaño, 
            recurso.ruta
        ]);
        return result;
    }
}

module.exports = RecursoRepository;