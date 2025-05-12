import React from "react";
import { Link } from "react-router-dom";
import imagenHome from "/images/studyhub3.5.JPG";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-white">
      <header className="bg-slate-900 p-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-10 ml-2">
          <Link to="/" className="text-2xl font-bold cursor-pointer">
            <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
          </Link>
          <nav className="flex gap-4 text-white font-medium">
            <Link to="/simulacros" className="hover:underline">Simulacros</Link>
            <a href="/public/Recursos.html" className="hover:underline">Recursos</a>
          </nav>
        </div>

        <div className="flex gap-4 mr-2">
          <a href="/public/login.html">
            <button className="bg-white text-slate-900 px-4 py-2 rounded font-medium hover:bg-gray-200 transition">Login</button>
          </a>
          <a href="/public/signup.html">
            <button className="bg-white text-slate-900 px-4 py-2 rounded font-medium hover:bg-gray-200 transition">Sign Up</button>
          </a>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-44 py-20 sm:flex-row sm:justify-around gap-5">
        <div className="bg-gray-700 p-16 rounded-lg max-w-md text-center">
          <h2 className="text-4xl font-semibold mb-4">Bienvenido a StudyHub</h2>
          <p className="text-ls">
          Inspiramos a estudiantes a dominar sus exámenes con un repositorio colaborativo que ofrece recursos prácticos, una comunidad vibrante, y herramientas innovadoras como búsqueda inteligente, simulaciones interactivas y organización eficiente para aprender y prepararse con precisión.
          </p>
        </div>
          <div className="w-full max-w-xl min-h-[430px] rounded-lg shadow bg-gray-600 flex items-center justify-center text-gray-400 p-4">
            <img
              src={imagenHome}
              alt="Logo Studyhub"
              className="w-full h-auto max-w-lg rounded-lg shadow"/>
        </div>
      </main>
    </div>
  );
}
