import React from "react";
import { useNavigate, Link } from "react-router-dom";

const cursos = [
  { nombre: "Ciencia de la Computación II", path: "cc2" },
  { nombre: "Álgebra Abstracta", path: "algebra" },
  { nombre: "Arquitectura de Computadoras", path: "arquitectura" },
  { nombre: "Cálculo I", path: "calculo" },
];

export default function Simulacros() {
  const navigate = useNavigate();

  const manejarClick = (path) => {
    navigate(`/simulacros/${path}`);
  };

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

      {/* Contenido */}
      <main className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-10 text-center">Selecciona un curso para comenzar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {cursos.map((curso) => (
            <button
              key={curso.path}
              onClick={() => manejarClick(curso.path)}
              className="bg-slate-800 text-white py-6 px-4 rounded-xl shadow hover:bg-slate-700 transition text-lg font-medium"
            >
              {curso.nombre}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}