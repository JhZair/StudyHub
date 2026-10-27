const PUNTAJE_MAXIMO = 100;

const esEnteroPositivo = (valor) => Number.isInteger(valor) && valor > 0;
const esFechaValida = (valor) => valor instanceof Date && !isNaN(valor.getTime());

class Simulacro {
  constructor({ id_examen = null, duracion, preguntas, puntaje = null, fecha_realizacion = null, id_curso, id_usuario }) {
    if (id_examen !== null && !esEnteroPositivo(id_examen)) {
      throw new Error('id_examen debe ser un entero positivo');
    }
    if (!esEnteroPositivo(duracion)) {
      throw new Error('duracion debe ser un entero positivo');
    }
    if (!esEnteroPositivo(preguntas)) {
      throw new Error('preguntas debe ser un entero positivo');
    }
    if (puntaje !== null && (!Number.isInteger(puntaje) || puntaje < 0 || puntaje > PUNTAJE_MAXIMO)) {
      throw new Error(`puntaje debe ser un entero entre 0 y ${PUNTAJE_MAXIMO}`);
    }
    if (fecha_realizacion !== null && !esFechaValida(fecha_realizacion)) {
      throw new Error('fecha_realizacion debe ser una fecha valida');
    }
    if (!esEnteroPositivo(id_curso)) {
      throw new Error('id_curso debe ser un entero positivo');
    }
    if (!esEnteroPositivo(id_usuario)) {
      throw new Error('id_usuario debe ser un entero positivo');
    }

    this.id_examen = id_examen;
    this.duracion = duracion;
    this.preguntas = preguntas;
    this.puntaje = puntaje;
    this.fecha_realizacion = fecha_realizacion;
    this.id_curso = id_curso;
    this.id_usuario = id_usuario;
  }
}

module.exports = Simulacro;
