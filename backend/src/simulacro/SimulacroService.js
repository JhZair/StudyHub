const Simulacro = require('./model/Simulacro');

// Errores de negocio: los controllers deciden el status HTTP segun `codigo`
const errorDeNegocio = (codigo, mensaje) => Object.assign(new Error(mensaje), { codigo });

class SimulacroService {
  constructor(simulacroRepository) {
    this.simulacroRepository = simulacroRepository;
  }

  async listar() {
    return this.simulacroRepository.findAll();
  }

  async registrar({ duracion, preguntas, puntaje, id_curso, id_usuario }) {
    let simulacro;
    try {
      simulacro = new Simulacro({ duracion, preguntas, puntaje: puntaje ?? null, id_curso, id_usuario });
    } catch (err) {
      throw errorDeNegocio('VALIDACION', err.message);
    }

    return this.simulacroRepository.save(simulacro);
  }
}

module.exports = SimulacroService;
