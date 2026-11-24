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
        const query = `
            INSERT INTO recursos (titulo, descripcion, id_curso, id_usuario, url) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            recurso.titulo, 
            recurso.descripcion || '', 
            recurso.id_curso, 
            recurso.id_usuario, 
            recurso.url
        ];

        const [result] = await this.db.query(query, params);
        return result;
    }
}

module.exports = RecursoRepository;