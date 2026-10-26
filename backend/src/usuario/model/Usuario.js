const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LONGITUD = 100;

const esFechaValida = (valor) => valor instanceof Date && !isNaN(valor.getTime());

class Usuario {
  constructor({ id_usuario = null, nombre, email, password, universidad = null, fecha_registro, ultimo_acceso = null }) {
    if (id_usuario !== null && (!Number.isInteger(id_usuario) || id_usuario <= 0)) {
      throw new Error('id_usuario debe ser un entero positivo');
    }

    if (typeof nombre !== 'string' || nombre.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }
    if (nombre.trim().length > MAX_LONGITUD) {
      throw new Error(`El nombre no puede superar ${MAX_LONGITUD} caracteres`);
    }

    if (typeof email !== 'string' || email.trim() === '') {
      throw new Error('El email es obligatorio');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('El email no tiene un formato valido');
    }
    if (email.length > MAX_LONGITUD) {
      throw new Error(`El email no puede superar ${MAX_LONGITUD} caracteres`);
    }

    if (typeof password !== 'string' || password === '') {
      throw new Error('La password es obligatoria');
    }
    if (password.length > MAX_LONGITUD) {
      throw new Error(`La password no puede superar ${MAX_LONGITUD} caracteres`);
    }

    if (universidad !== null) {
      if (typeof universidad !== 'string' || universidad.trim() === '') {
        throw new Error('La universidad no puede estar vacia');
      }
      if (universidad.length > MAX_LONGITUD) {
        throw new Error(`La universidad no puede superar ${MAX_LONGITUD} caracteres`);
      }
    }

    if (fecha_registro === undefined || fecha_registro === null) {
      fecha_registro = new Date();
    } else if (!esFechaValida(fecha_registro)) {
      throw new Error('fecha_registro debe ser una fecha valida');
    }

    if (ultimo_acceso !== null) {
      if (!esFechaValida(ultimo_acceso)) {
        throw new Error('ultimo_acceso debe ser una fecha valida');
      }
      if (ultimo_acceso < fecha_registro) {
        throw new Error('ultimo_acceso no puede ser anterior a fecha_registro');
      }
    }

    this.id_usuario = id_usuario;
    this.nombre = nombre.trim();
    this.email = email;
    this.password = password;
    this.universidad = universidad;
    this.fecha_registro = fecha_registro;
    this.ultimo_acceso = ultimo_acceso;
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
