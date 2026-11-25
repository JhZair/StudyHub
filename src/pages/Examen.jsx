import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PreguntaExamen from '../components/PreguntaExamen';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Examen() {
  const { cursoSlug } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    import(`../data/preguntas/${cursoSlug}.json`)
      .then((mod) => setPreguntas(mod.default))
      .catch(() => setError('No se pudieron cargar las preguntas.'));
  }, [cursoSlug]);

  const manejarRespuesta = (preguntaId, opcion) => {
    if (!finalizado) {
      setRespuestas((prev) => ({ ...prev, [preguntaId]: opcion }));
    }
  };

  const finalizarExamen = async () => {
    let puntos = 0;
    preguntas.forEach((pregunta) => {
      const respuestaSeleccionada = respuestas[pregunta.id];
      if (respuestaSeleccionada === pregunta.respuestaCorrecta) {
        puntos++;
      }
    });

    setPuntaje(puntos);
    setFinalizado(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/simulacros/puntajes/guardar`, {
        duracion: preguntas.length * 2,
        preguntas: preguntas.length,
        puntaje: puntos,
        id_curso: 2,
        id_usuario: currentUser?.id_usuario || currentUser?.id
      });
    } catch (err) {
      console.error('Error guardando puntaje:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-white">
      <Navbar />
      <main className="p-4 max-w-4xl mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {preguntas.map((pregunta) => (
          <PreguntaExamen
            key={pregunta.id}
            pregunta={pregunta}
            respuestaSeleccionada={respuestas[pregunta.id]}
            finalizado={finalizado}
            onSeleccionar={manejarRespuesta}
          />
        ))}

        {!finalizado && preguntas.length > 0 && (
          <div className="text-center mt-10">
            <button
              type="button"
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