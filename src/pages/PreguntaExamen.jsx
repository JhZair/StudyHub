import React from 'react';

export default function PreguntaExamen({
  pregunta,
  respuestaSeleccionada,
  finalizado,
  onSeleccionar
}) {
  let feedback = null;

  if (finalizado) {
    if (respuestaSeleccionada === pregunta.respuestaCorrecta) {
      feedback = <span className="text-green-400">✔ Correcta</span>;
    } else if (respuestaSeleccionada) {
      feedback = (
        <span className="text-red-400">
          ✘ Incorrecta. Respuesta correcta: <strong>{pregunta.respuestaCorrecta}</strong>
        </span>
      );
    } else {
      feedback = (
        <span className="text-yellow-300">
          ⚠ Sin responder. Respuesta correcta: <strong>{pregunta.respuestaCorrecta}</strong>
        </span>
      );
    }
  }

  return (
    <div className="mb-6 p-6 border rounded bg-black shadow">
      <p className="font-semibold text-xl mb-4">{pregunta.enunciado}</p>
      <div className="space-y-2">
        {pregunta.opciones.map((opcion) => {
          const estaSeleccionada = respuestaSeleccionada === opcion;
          const claseBoton = `w-full text-left p-3 rounded font-medium transition ${
            estaSeleccionada ? 'bg-blue-700 text-white' : 'bg-gray-800 text-white'
          } ${finalizado ? 'pointer-events-none' : 'hover:bg-blue-600'}`;

          return (
            <button
              key={opcion}
              type="button"
              disabled={finalizado}
              onClick={() => onSeleccionar(pregunta.id, opcion)}
              className={claseBoton}
            >
              {opcion}
            </button>
          );
        })}
      </div>
      {finalizado && <p className="mt-3">{feedback}</p>}
    </div>
  );
}