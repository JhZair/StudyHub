import React from "react";
import { Link } from "react-router-dom";
import imagenHome from "/images/studyhub2.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-white">
      {/* Header similar al de Simulacros */}
      <header className="bg-slate-900 p-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-10 ml-2">
          <Link to="/" className="text-2xl font-bold cursor-pointer">
            <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
          </Link>
          <nav className="flex gap-4 text-white font-medium">
            <Link to="/simulacros" className="hover:underline">Simulacros</Link>
            <a href="/Recursos.html" className="hover:underline">Recursos</a>
          </nav>
        </div>

        <div className="flex gap-4 mr-2">
          <a href="/login.html">
            <button className="bg-white text-slate-900 px-4 py-2 rounded font-medium hover:bg-gray-200 transition">Login</button>
          </a>
          <a href="/signup.html">
            <button className="bg-white text-slate-900 px-4 py-2 rounded font-medium hover:bg-gray-200 transition">Sign Up</button>
          </a>
        </div>
      </header>

      {/* Contenido central: texto + espacio para imagen */}
      <main className="flex flex-col items-center justify-center px-44 py-20 sm:flex-row sm:justify-around gap-5">
        <div className="bg-gray-700 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Bienvenido a StudyHub</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            Sed cursus ante dapibus diam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            Sed cursus ante dapibus diam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            Sed cursus ante dapibus diam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            Sed cursus ante dapibus diam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            Sed cursus ante dapibus diam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            Sed cursus ante dapibus diam.
          </p>
        </div>
          <div className="w-full max-w-2xl min-h-[430px] rounded-lg shadow bg-gray-600 flex items-center justify-center text-gray-400 p-4">
            <img
              src={imagenHome}
              alt="Logo Studyhub"
              className="w-full h-auto max-w-lg rounded-lg shadow"/>
        </div>
      </main>
    </div>
  );
}
