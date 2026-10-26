class IUsuarioRepository {
  // Devuelve el Usuario con ese email o null
  async findByEmail(_email) {
    throw new Error('No implementado');
  }

  // Devuelve el Usuario con ese id o null
  async findById(_id) {
    throw new Error('No implementado');
  }

  // Devuelve un arreglo de Usuario
  async findAll() {
    throw new Error('No implementado');
  }

  // Persiste un Usuario nuevo y lo devuelve con su id_usuario
  async save(_usuario) {
    throw new Error('No implementado');
  }
}

module.exports = IUsuarioRepository;
