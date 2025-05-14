import React from "react";
import { Link } from "react-router-dom";
import imagenHome from "/images/studyhub3.5.JPG";
import Auth from "../components/Auth";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-white flex flex-col">
      <header className="bg-slate-900 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 ml-2">
            <Link to="/" className="text-2xl font-bold cursor-pointer">
              <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
            </Link>
            <nav className="flex gap-4 text-white font-medium">
              <Link to="/simulacros" className="hover:underline">Simulacros</Link>
              <a href="/Recursos.html" className="hover:underline">Recursos</a>
            </nav>
          </div>
          <div className="flex gap-3 justify-center sm:justify-end mr-2">
            {currentUser ? (
              <div className="flex gap-2">
                <Link
                  to="/perfil"
                  className="bg-white text-slate-900 px-3 py-2 rounded font-medium hover:bg-gray-300 flex items-center"
                >
                  {currentUser.nombre}
                </Link>
                <button
                  className="bg-red-600 text-white px-3 py-2 rounded font-medium hover:bg-red-700"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Auth />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col-reverse sm:flex-row items-center justify-center px-4 sm:px-10 lg:px-24 py-10 gap-10">
        <div className="bg-gray-700 p-8 sm:p-12 rounded-lg max-w-md text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Bienvenido a StudyHub</h2>
          <p className="text-base sm:text-lg">
            Inspiramos a estudiantes a dominar sus exámenes con un repositorio colaborativo que ofrece recursos prácticos, una comunidad vibrante y herramientas innovadoras como búsqueda inteligente, simulaciones interactivas y organización eficiente.
          </p>
        </div>

        <div className="w-full max-w-lg min-w-[250px] rounded-lg shadow bg-gray-600 flex items-center justify-center p-4">
          <img
            src={imagenHome}
            alt="Logo Studyhub"
            className="w-full h-auto rounded-lg shadow"
          />
        </div>
      </main>
    </div>
  );
}
