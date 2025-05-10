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
      <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-blue-600 text-white text-center py-2 px-4 rounded mb-6">
          <h2 className="text-xl font-semibold">Semestre III</h2>
        </div>
        <h1 className="text-3xl font-bold mb-10 text-center">Selecciona un curso para comenzar</h1>
        <div className="grid w-full max-w-3xl grid-cols-1 sm:grid-cols-2 gap-6">
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