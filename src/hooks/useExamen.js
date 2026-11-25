import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useExamen(preguntasIniciales, idSimulacro, idUsuario) {
    const [indiceActual, setIndiceActual] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [finalizado, setFinalizado] = useState(false);
    const [puntajeTotal, setPuntajeTotal] = useState(0);
    const navigate = useNavigate();

    const seleccionarRespuesta = (preguntaId, opcionIndice) => {
        setRespuestas((prev) => ({
            ...prev,
            [preguntaId]: opcionIndice
        }));
    };

    const siguientePregunta = () => {
        if (indiceActual < preguntasIniciales.length - 1) {
            setIndiceActual((prev) => prev + 1);
        }
    };

    const anteriorPregunta = () => {
        if (indiceActual > 0) {
            setIndiceActual((prev) => prev - 1);
        }
    };

    const enviarExamen = async () => {
        let correctas = 0;
        preguntasIniciales.forEach((preg, idx) => {
            if (respuestas[idx] === preg.respuestaCorrecta) {
                correctas += 1;
            }
        });

        const puntajeFinal = Math.round((correctas / preguntasIniciales.length) * 100);
        setPuntajeTotal(puntajeFinal);
        setFinalizado(true);

        if (idUsuario && idSimulacro) {
            try {
                await fetch('/api/simulacros/puntajes/guardar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_usuario: idUsuario,
                        id_simulacro: idSimulacro,
                        puntaje: puntajeFinal
                    })
                });
            } catch (err) {
                console.error('Error al guardar puntaje:', err);
            }
        }
    };

    return {
        indiceActual,
        preguntaActual: preguntasIniciales[indiceActual],
        totalPreguntas: preguntasIniciales.length,
        respuestas,
        finalizado,
        puntajeTotal,
        seleccionarRespuesta,
        siguientePregunta,
        anteriorPregunta,
        enviarExamen,
        navigate
    };
}