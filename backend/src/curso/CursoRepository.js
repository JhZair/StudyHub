const ICursoRepository = require('./model/ICursoRepository');
const Curso = require('./model/Curso');

class CursoRepository extends ICursoRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM curso');
    return rows.map((row) => new Curso(row));
  }

  async findById(id) {
    const [rows] = await this.db.query('SELECT * FROM curso WHERE id_curso = ?', [id]);
    return rows.length > 0 ? new Curso(rows[0]) : null;
  }

  async save(curso) {
    try {
      const [result] = await this.db.query(
        'INSERT INTO curso (nombre, area) VALUES (?, ?)',
        [curso.nombre, curso.area]
      );
      return new Curso({ ...curso, id_curso: result.insertId });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw Object.assign(new Error('Ya existe un curso con ese nombre'), { codigo: 'CURSO_DUPLICADO' });
      }
      throw err;
    }
  }
}

module.exports = CursoRepository;
