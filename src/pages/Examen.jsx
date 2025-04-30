import React from "react";
import { useParams, Link } from "react-router-dom";

export default function Examen() {
  const { curso } = useParams();
  const nombreCurso = {
    cc2: "Ciencia de la Computación II",
    algebra: "Álgebra Abstracta",
    arquitectura: "Arquitectura de Computadoras",
    calculo: "Cálculo I",
  }[curso] || curso;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabecera */}
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <Link to="/">
          <div className="text-2xl font-bold ml-2 cursor-pointer">
            <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
          </div>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Simulacro - {nombreCurso}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="mb-4 text-gray-700">Aquí puedes comenzar a añadir las preguntas para el curso <strong>{nombreCurso}</strong>.</p>
          <ul className="space-y-6">
            <li className="border border-gray-300 rounded p-4">
              <p className="font-medium">Pregunta 1:</p>
              <p className="text-sm text-gray-600">[Aquí va el enunciado de la pregunta]</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm">a) Opción A</p>
                <p className="text-sm">b) Opción B</p>
                <p className="text-sm">c) Opción C</p>
                <p className="text-sm">d) Opción D</p>
              </div>
            </li>
            {/* Puedes duplicar el bloque anterior para más preguntas */}
          </ul>
        </div>
      </main>
    </div>
  );
}