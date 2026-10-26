const bcrypt = require('bcryptjs');
const Usuario = require('./model/Usuario');

const SALT_ROUNDS = 10;
const MIN_PASSWORD = 8;

// Errores de negocio: los controllers deciden el status HTTP segun `codigo`
const errorDeNegocio = (codigo, mensaje) => Object.assign(new Error(mensaje), { codigo });

class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async registrar({ nombre, email, password, universidad }) {
    if (!nombre || !email || !password || !universidad) {
      throw errorDeNegocio('VALIDACION', 'Faltan campos');
    }
    if (password.length < MIN_PASSWORD) {
      throw errorDeNegocio('VALIDACION', `La password debe tener al menos ${MIN_PASSWORD} caracteres`);
    }

    const ahora = new Date();
    let usuario;
    try {
      usuario = new Usuario({ nombre, email, password, universidad, fecha_registro: ahora, ultimo_acceso: ahora });
    } catch (err) {
      throw errorDeNegocio('VALIDACION', err.message);
    }

    if (await this.usuarioRepository.findByEmail(email)) {
      throw errorDeNegocio('EMAIL_DUPLICADO', 'Correo ya registrado');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const guardado = await this.usuarioRepository.save(new Usuario({ ...usuario, password: hash }));
    return guardado.sinPassword();
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw errorDeNegocio('VALIDACION', 'Faltan campos');
    }

    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      throw errorDeNegocio('CREDENCIALES_INVALIDAS', 'Credenciales inválidas');
    }

    return usuario.sinPassword();
  }

  async listar() {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map((usuario) => usuario.sinPassword());
  }
}

module.exports = UsuarioService;
