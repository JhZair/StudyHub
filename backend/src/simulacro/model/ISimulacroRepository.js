class ISimulacroRepository {
  // Devuelve un arreglo de Simulacro
  async findAll() {
    throw new Error('No implementado');
  }

  // Devuelve el Simulacro con ese id o null
  async findById(_id) {
    throw new Error('No implementado');
  }

  // Persiste un Simulacro nuevo y lo devuelve con su id_examen
  async save(_simulacro) {
    throw new Error('No implementado');
  }
}

module.exports = ISimulacroRepository;
