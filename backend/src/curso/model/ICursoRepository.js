class ICursoRepository {
  // Devuelve un arreglo de Curso
  async findAll() {
    throw new Error('No implementado');
  }

  // Devuelve el Curso con ese id o null
  async findById(_id) {
    throw new Error('No implementado');
  }

  // Persiste un Curso nuevo y lo devuelve con su id_curso
  async save(_curso) {
    throw new Error('No implementado');
  }
}

module.exports = ICursoRepository;
