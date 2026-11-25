const Simulacro = require('./model/Simulacro');

// Errores de negocio: los controllers/manejadorErrores deciden el status HTTP segun `codigo`
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

  // Fix #41: Guardar puntaje de intento
  async guardarPuntaje(datosPuntaje) {
    const { id_usuario, id_simulacro, puntaje } = datosPuntaje || {};

    if (!id_usuario || !id_simulacro) {
      throw errorDeNegocio('VALIDACION', 'El id_usuario e id_simulacro son obligatorios');
    }
    if (typeof puntaje !== 'number' || Number.isNaN(puntaje)) {
      throw errorDeNegocio('VALIDACION', 'El puntaje debe ser un número válido');
    }

    return await this.simulacroRepository.guardarPuntaje(null, id_usuario, id_simulacro, puntaje);
  }

  // Fix #41: Obtener historial de puntajes por usuario
  async obtenerPuntajesPorUsuario(idUsuario) {
    if (!idUsuario) {
      throw errorDeNegocio('VALIDACION', 'El id_usuario es obligatorio');
    }
    return await this.simulacroRepository.obtenerPuntajesPorUsuario(idUsuario);
  }
}

module.exports = SimulacroService;