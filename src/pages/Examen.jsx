import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const preguntasPorCurso = {
  cc2: [
    {
      pregunta: "¿Qué estructura de datos se usa para implementar una cola?",
      opciones: ["Pila", "Árbol", "Lista enlazada", "Tabla hash"],
      correcta: 2,
    },
    {
      pregunta: "¿Qué complejidad tiene el algoritmo de búsqueda binaria?",
      opciones: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correcta: 1,
    },
    {
      pregunta: "¿Qué es un puntero en C?",
      opciones: ["Una constante", "Una variable que almacena direcciones", "Una función", "Una clase"],
      correcta: 1,
    },
  ],
  algebra: [
    {
      pregunta: "¿Cuál es el neutro multiplicativo en un grupo?",
      opciones: ["0", "1", "-1", "No existe"],
      correcta: 1,
    },
    {
      pregunta: "¿Qué propiedad debe tener un grupo para ser abeliano?",
      opciones: ["Distributiva", "Conmutativa", "Asociativa", "Inversos"],
      correcta: 1,
    },
    {
      pregunta: "¿Cuál es la identidad aditiva?",
      opciones: ["1", "0", "-1", "Infinito"],
      correcta: 1,
    },
  ],
  arquitectura: [
    {
      pregunta: "¿Qué hace la ALU?",
      opciones: ["Gestiona memoria", "Ejecuta operaciones aritméticas", "Controla el flujo", "Carga instrucciones"],
      correcta: 1,
    },
    {
      pregunta: "¿Qué componente ejecuta instrucciones en una CPU?",
      opciones: ["RAM", "Disco duro", "Unidad de control", "ALU"],
      correcta: 2,
    },
    {
      pregunta: "¿Qué tipo de memoria es más rápida?",
      opciones: ["RAM", "Cache", "ROM", "Disco SSD"],
      correcta: 1,
    },
  ],
  calculo: [
    {
      pregunta: "¿Cuál es la derivada de x^2?",
      opciones: ["2x", "x", "x^2", "1"],
      correcta: 0,
    },
    {
      pregunta: "¿Qué es una integral definida?",
      opciones: [
        "El área bajo la curva en un intervalo",
        "Un límite",
        "Una derivada",
        "Una función constante",
      ],
      correcta: 0,
    },
    {
      pregunta: "¿Qué significa que una función sea continua?",
      opciones: [
        "Que es derivable",
        "Que su gráfica tiene saltos",
        "Que no tiene interrupciones",
        "Que es constante",
      ],
      correcta: 2,
    },
  ],
};

export default function Examen() {
  const { curso } = useParams();

  const nombreCurso = {
    cc2: "Ciencia de la Computación II",
    algebra: "Álgebra Abstracta",
    arquitectura: "Arquitectura de Computadoras",
    calculo: "Cálculo I",
  }[curso] || curso;

  const preguntas = preguntasPorCurso[curso] || [];
  const [respuestas, setRespuestas] = useState({});
  const [verificadas, setVerificadas] = useState({});
  const [mostrarPuntaje, setMostrarPuntaje] = useState(false);

  const verificarRespuesta = (index) => {
    if (respuestas[index] !== undefined) {
      setVerificadas((prev) => ({ ...prev, [index]: true }));
    }
  };

  const calcularPuntaje = () => {
    let correctas = 0;
    preguntas.forEach((p, i) => {
      if (respuestas[i] === p.correcta) correctas++;
    });
    return `${correctas} / ${preguntas.length}`;
  };

  const todasRespondidas = preguntas.length > 0 &&
    preguntas.every((_, i) => verificadas[i]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 p-4 flex items-center justify-between shadow-md">
        <Link to="/">
          <div className="text-2xl font-bold ml-2 cursor-pointer">
            <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
          </div>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Simulacro - {nombreCurso}</h1>
        <div className="bg-slate-800 rounded-lg shadow p-6">
          {preguntas.length > 0 ? (
            <ul className="space-y-6">
              {preguntas.map((preg, index) => (
                <li key={index} className="border border-slate-600 rounded p-4">
                  <p className="font-medium mb-2">{index + 1}. {preg.pregunta}</p>
                  <div className="space-y-1 mb-2">
                    {preg.opciones.map((opcion, i) => (
                      <label key={i} className="block">
                        <input
                          type="radio"
                          name={`pregunta-${index}`}
                          className="mr-2"
                          disabled={verificadas[index]}
                          onChange={() =>
                            setRespuestas((prev) => ({ ...prev, [index]: i }))
                          }
                          checked={respuestas[index] === i}
                        />
                        {opcion}
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => verificarRespuesta(index)}
                    disabled={verificadas[index] || respuestas[index] === undefined}
                    className={`px-4 py-2 rounded transition ${
                      verificadas[index]
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Verificar respuesta
                  </button>
                  {verificadas[index] && respuestas[index] === preg.correcta && (
                    <p className="mt-2 text-green-400 font-semibold">¡Correcto!</p>
                  )}
                  {verificadas[index] && respuestas[index] !== preg.correcta && (
                    <p className="mt-2 text-red-400 font-semibold">Incorrecto.</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay preguntas disponibles para este curso.</p>
          )}
        </div>

        {todasRespondidas && (
          <div className="text-center mt-6">
            <h2 className="text-xl font-bold text-white mb-2">Puntaje final</h2>
            <p className="text-2xl text-blue-400 font-bold">{calcularPuntaje()}</p>
          </div>
        )}
      </main>
    </div>
  );
}
