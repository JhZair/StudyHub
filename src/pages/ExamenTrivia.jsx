import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ExamenTrivia() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);

  useEffect(() => {
    const decodeHTMLEntities = (text) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = text;
        return txt.value;
    };

    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then((res) => res.json())
        .then((data) => {
        const formateadas = data.results.map((item, index) => ({
            id: index + 1,
            enunciado: decodeHTMLEntities(item.question),
            opciones: [...item.incorrect_answers, item.correct_answer]
            .map(decodeHTMLEntities)
            .sort(() => Math.random() - 0.5),
            respuestaCorrecta: decodeHTMLEntities(item.correct_answer),
        }));
        setPreguntas(formateadas);
        });
    }, []);

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
        <h1 className="text-3xl text-black font-bold mb-6">Trivia OpenTrivia</h1>

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
              Finalizar trivia
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
