import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const cursosPorSemestre = {
  I: ["Curso 1.1", "Curso 1.2", "Curso 1.3", "Curso 1.4", "Curso 1.5", "Curso 1.6"],
  II: ["Curso 2.1", "Curso 2.2", "Curso 2.3", "Curso 2.4", "Curso 2.5", "Curso 2.6"],
  III: ["Cálculo","Ciencia de la computación II","Álgebra abstracta","Desarrollo basado en plataformas","Arqutectura de computadores","Antropología filosófica y teológica"],
};

export default function Simulacros() {
  const [semestresAbiertos, setSemestresAbiertos] = useState({});

  const toggleSemestre = (semestre) => {
    setSemestresAbiertos((prev) => ({
      ...prev,
      [semestre]: !prev[semestre],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-300">
      <header className="bg-slate-900 p-7 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-10 ml-1">
          <Link to="/" className="text-2xl font-bold cursor-pointer">
            <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
          </Link>
          <nav className="flex gap-4 text-white font-medium">
            <a href="/Recursos.html" className="hover:underline">Recursos</a>
          </nav>
        </div>
      </header>

      <main className="flex flex-col items-center justify-start py-10 px-4">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl">
          {["I", "II", "III"].map((semestre) => (
            <div key={semestre} className="mb-6">
              <button
                onClick={() => toggleSemestre(semestre)}
                className="w-full bg-blue-800 text-white font-semibold text-left px-7 py-6 rounded flex justify-between items-center"
              >
                <span className="text-2xl sm:text-2xl md:text-3xl font-bold"> Semestre {semestre}</span>
                <span className="text-xl">{semestresAbiertos[semestre] ? "▲" : "▼"}</span>
              </button>

              {semestresAbiertos[semestre] && (
                <div className="text-xl mt-4 grid grid-cols-1 font-semibold sm:grid-cols-2 md:grid-cols-3 gap-4 px-2">
                  {cursosPorSemestre[semestre].map((curso, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 text-white py-4 text-center rounded shadow"
                    >
                      {curso}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}