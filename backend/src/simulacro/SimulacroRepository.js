const ISimulacroRepository = require('./model/ISimulacroRepository');
const Simulacro = require('./model/Simulacro');

class SimulacroRepository extends ISimulacroRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM simulacros_examenes');
    return rows.map((row) => new Simulacro(row));
  }

  async findById(id) {
    const [rows] = await this.db.query('SELECT * FROM simulacros_examenes WHERE id_examen = ?', [id]);
    return rows.length > 0 ? new Simulacro(rows[0]) : null;
  }

  async save(simulacro) {
    try {
      const [result] = await this.db.query(
        'INSERT INTO simulacros_examenes (duracion, preguntas, puntaje, id_curso, id_usuario) VALUES (?, ?, ?, ?, ?)',
        [simulacro.duracion, simulacro.preguntas, simulacro.puntaje, simulacro.id_curso, simulacro.id_usuario]
      );
      return new Simulacro({ ...simulacro, id_examen: result.insertId });
    } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        throw Object.assign(new Error('El curso o el usuario no existe'), { codigo: 'REFERENCIA_INVALIDA' });
      }
      throw err;
    }
  }
}

module.exports = SimulacroRepository;
