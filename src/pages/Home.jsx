import React from "react";
import imagenHome from "/images/studyhub3.5.JPG";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-white flex flex-col">
      <Navbar />
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
