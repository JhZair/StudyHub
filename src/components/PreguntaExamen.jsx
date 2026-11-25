import React from 'react';

export default function PreguntaExamen({
    pregunta,
    indiceActual,
    totalPreguntas,
    respuestaSeleccionada,
    onSeleccionar,
    onAnterior,
    onSiguiente,
    onEnviar
}) {
    if (!pregunta) return null;

    const esUltima = indiceActual === totalPreguntas - 1;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-8">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-slate-500">
                    Pregunta {indiceActual + 1} de {totalPreguntas}
                </span>
            </div>

            <h3 className="text-xl font-bold mb-6 text-slate-800">{pregunta.enunciado}</h3>

            <div className="space-y-3 mb-8">
                {pregunta.opciones.map((opcion, idx) => {
                    const estaSeleccionada = respuestaSeleccionada === idx;
                    const claseBoton = estaSeleccionada
                        ? 'w-full text-left p-4 rounded border-2 border-indigo-600 bg-indigo-50 font-medium'
                        : 'w-full text-left p-4 rounded border border-gray-300 hover:bg-gray-50';

                    return (
                        <button
                            key={opcion}
                            type="button"
                            onClick={() => onSeleccionar(indiceActual, idx)}
                            className={claseBoton}
                        >
                            {opcion}
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onAnterior}
                    disabled={indiceActual === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    Anterior
                </button>

                {esUltima ? (
                    <button
                        type="button"
                        onClick={onEnviar}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700"
                    >
                        Enviar Examen
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onSiguiente}
                        className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-900"
                    >
                        Siguiente
                    </button>
                )}
            </div>
        </div>
    );
}