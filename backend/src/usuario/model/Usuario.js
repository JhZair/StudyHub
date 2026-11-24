// Sin solapamiento entre los tramos del dominio: no hay backtracking
const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s@.]*\.[^\s@]+$/;
const MAX_LONGITUD = 100;

const esFechaValida = (valor) => valor instanceof Date && !Number.isNaN(valor.getTime());
const esTextoVacio = (valor) => typeof valor !== 'string' || valor.trim() === '';

class Usuario {
  constructor({ id_usuario = null, nombre, email, password, universidad = null, fecha_registro, ultimo_acceso = null }) {
    Usuario.#validarIdUsuario(id_usuario);
    Usuario.#validarNombre(nombre);
    Usuario.#validarEmail(email);
    Usuario.#validarPassword(password);
    Usuario.#validarUniversidad(universidad);
    const fechaRegistro = Usuario.#validarFechaRegistro(fecha_registro);
    Usuario.#validarUltimoAcceso(ultimo_acceso, fechaRegistro);

    this.id_usuario = id_usuario;
    this.nombre = nombre.trim();
    this.email = email;
    this.password = password;
    this.universidad = universidad;
    this.fecha_registro = fechaRegistro;
    this.ultimo_acceso = ultimo_acceso;
  }

  static #validarIdUsuario(id_usuario) {
    if (id_usuario !== null && (!Number.isInteger(id_usuario) || id_usuario <= 0)) {
      throw new Error('id_usuario debe ser un entero positivo');
    }
  }

  static #validarNombre(nombre) {
    if (esTextoVacio(nombre)) {
      throw new Error('El nombre es obligatorio');
    }
    if (nombre.trim().length > MAX_LONGITUD) {
      throw new Error(`El nombre no puede superar ${MAX_LONGITUD} caracteres`);
    }
  }

  static #validarEmail(email) {
    if (esTextoVacio(email)) {
      throw new Error('El email es obligatorio');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('El email no tiene un formato valido');
    }
    if (email.length > MAX_LONGITUD) {
      throw new Error(`El email no puede superar ${MAX_LONGITUD} caracteres`);
    }
  }

  static #validarPassword(password) {
    if (typeof password !== 'string' || password === '') {
      throw new Error('La password es obligatoria');
    }
    if (password.length > MAX_LONGITUD) {
      throw new Error(`La password no puede superar ${MAX_LONGITUD} caracteres`);
    }
  }

  static #validarUniversidad(universidad) {
    if (universidad === null) {
      return;
    }
    if (esTextoVacio(universidad)) {
      throw new Error('La universidad no puede estar vacia');
    }
    if (universidad.length > MAX_LONGITUD) {
      throw new Error(`La universidad no puede superar ${MAX_LONGITUD} caracteres`);
    }
  }

  // Devuelve la fecha de registro, o la actual si no viene
  static #validarFechaRegistro(fecha_registro) {
    if (fecha_registro === undefined || fecha_registro === null) {
      return new Date();
    }
    if (!esFechaValida(fecha_registro)) {
      throw new Error('fecha_registro debe ser una fecha valida');
    }
    return fecha_registro;
  }

  static #validarUltimoAcceso(ultimo_acceso, fecha_registro) {
    if (ultimo_acceso === null) {
      return;
    }
    if (!esFechaValida(ultimo_acceso)) {
      throw new Error('ultimo_acceso debe ser una fecha valida');
    }
    if (ultimo_acceso < fecha_registro) {
      throw new Error('ultimo_acceso no puede ser anterior a fecha_registro');
    }
  }

  // Datos del usuario sin la password, para respuestas HTTP y sesion
  sinPassword() {
    return {
      id_usuario: this.id_usuario,
      nombre: this.nombre,
      email: this.email,
      fecha_registro: this.fecha_registro,
      ultimo_acceso: this.ultimo_acceso,
      universidad: this.universidad
    };
  }
}

module.exports = Usuario;
