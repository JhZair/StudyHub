const MAX_LONGITUD = 100;

class Curso {
  constructor({ id_curso = null, nombre, area = null }) {
    if (id_curso !== null && (!Number.isInteger(id_curso) || id_curso <= 0)) {
      throw new Error('id_curso debe ser un entero positivo');
    }

    if (typeof nombre !== 'string' || nombre.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }
    if (nombre.trim().length > MAX_LONGITUD) {
      throw new Error(`El nombre no puede superar ${MAX_LONGITUD} caracteres`);
    }

    if (area !== null) {
      if (typeof area !== 'string' || area.trim() === '') {
        throw new Error('El area no puede estar vacia');
      }
      if (area.trim().length > MAX_LONGITUD) {
        throw new Error(`El area no puede superar ${MAX_LONGITUD} caracteres`);
      }
    }

    this.id_curso = id_curso;
    this.nombre = nombre.trim();
    this.area = area === null ? null : area.trim();
  }
}

module.exports = Curso;
