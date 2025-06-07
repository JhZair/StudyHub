import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Auth from "./Auth";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-slate-900 p-6 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Logo + navegación */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 ml-2">
          <Link to="/" className="text-2xl font-bold cursor-pointer">
            <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
          </Link>
          <nav className="flex gap-4 text-white font-medium">
            <Link to="/simulacros" className="hover:underline">Simulacros</Link>
            <Link to="/recursos" className="hover:underline">Recursos1</Link>
            <a href="/Recursos.html" className="hover:underline">Recursos2</a>
          </nav>
        </div>

        {/* Perfil o login/signup */}
        <div className="flex gap-3 justify-center sm:justify-end mr-2">
          {currentUser ? (
            <div className="flex gap-2">
              <Link
                to="/perfil"
                className="bg-white text-slate-900 px-3 py-2 rounded font-medium hover:bg-gray-300 flex items-center"
              >
                {currentUser.nombre || "Perfil"}
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
  );
}
