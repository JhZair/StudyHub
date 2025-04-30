import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Bienvenido a StudyHub</h1>
        <p className="text-lg sm:text-xl mb-8">
          La mejor plataforma para practicar simulacros, mejorar tu ranking y dominar Ciencias de la Computación.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <a href="/simulacros">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
              Empezar ahora
            </button>
          </a>
          <a href="/Recursos.html">
          <button className="bg-transparent border border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-slate-900 transition">
            Ver Recursos
          </button>
          </a>
        </div>
        <div className="flex justify-center gap-4">
          <a href="/login.html">
            <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">Login</button>
          </a>
          <a href="/signup.html">
            <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">Sign Up</button>
          </a>
        </div>
      </div>
    </div>
  );
}