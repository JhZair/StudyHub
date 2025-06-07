import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function Examen() {
  const { cursoSlug } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    import(`../data/preguntas/${cursoSlug}.json`)
      .then((mod) => setPreguntas(mod.default))
      .catch(() => setError("No se pudieron cargar las preguntas."));
  }, [cursoSlug]);

  const manejarRespuesta = (preguntaId, opcion) => {
    if (!finalizado) {
      setRespuestas({ ...respuestas, [preguntaId]: opcion });
    }
  };

  const finalizarExamen = () => {
    let puntos = 0;
    preguntas.forEach((pregunta) => {
      const respuestaSeleccionada = respuestas[pregunta.id];
      if (respuestaSeleccionada === pregunta.respuestaCorrecta) {
        puntos++;
      }
    });
    setPuntaje(puntos);
    setFinalizado(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-white">
      <Navbar />
      <main className="p-4 max-w-4xl mx-auto">
        {error && <p className="text-red-500">{error}</p>}

        {preguntas.map((pregunta) => (
          <div key={pregunta.id} className="mb-6 p-6 border rounded bg-black shadow">
            <p className="font-semibold text-xl mb-4">{pregunta.enunciado}</p>
            <ul className="space-y-2">
              {pregunta.opciones.map((opcion, index) => (
                <li
                  key={index}
                  onClick={() => manejarRespuesta(pregunta.id, opcion)}
                  className={`cursor-pointer p-2 rounded ${
                    respuestas[pregunta.id] === opcion
                      ? "bg-blue-700 text-white"
                      : "bg-gray-800 text-white"
                  } ${finalizado ? "pointer-events-none" : "hover:bg-blue-600"}`}
                >
                  {opcion}
                </li>
              ))}
            </ul>
            {finalizado && (
              <p className="mt-2">
                {respuestas[pregunta.id] === pregunta.respuestaCorrecta
                  ? <span className="text-green-400">✔ Correcta</span>
                  : respuestas[pregunta.id]
                  ? <span className="text-red-400">✘ Incorrecta. Respuesta correcta: <strong>{pregunta.respuestaCorrecta}</strong></span>
                  : <span className="text-yellow-300">⚠ Sin responder. Respuesta correcta: <strong>{pregunta.respuestaCorrecta}</strong></span>}
              </p>
            )}
          </div>
        ))}

        {!finalizado && preguntas.length > 0 && (
          <div className="text-center mt-10">
            <button
              onClick={finalizarExamen}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg font-bold"
            >
              Finalizar examen
            </button>
          </div>
        )}

        {finalizado && (
          <div className="text-center mt-10 text-black font-bold text-2xl">
            Tu puntaje final: {puntaje} / {preguntas.length}
          </div>
        )}
      </main>
    </div>
  );
}
