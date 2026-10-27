const Curso = require('./model/Curso');

// Errores de negocio: los controllers deciden el status HTTP segun `codigo`
const errorDeNegocio = (codigo, mensaje) => Object.assign(new Error(mensaje), { codigo });

class CursoService {
  constructor(cursoRepository) {
    this.cursoRepository = cursoRepository;
  }

  async listar() {
    return this.cursoRepository.findAll();
  }

  async registrar({ nombre, area }) {
    let curso;
    try {
      curso = new Curso({ nombre, area: area ?? null });
    } catch (err) {
      throw errorDeNegocio('VALIDACION', err.message);
    }

    return this.cursoRepository.save(curso);
  }
}

module.exports = CursoService;
