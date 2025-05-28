import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Auth from '../components/Auth';

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
                  onClick={() => {
                    localStorage.removeItem('currentUser');
                    window.location.href = '/';
                  }}
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

      {/* Contenido de perfil */}
      <main className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-3xl shadow-lg">
        <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">Mi Perfil</h1>

        <div className="space-y-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Nombre completo</p>
            <p className="text-3xl font-bold text-slate-900">{currentUser?.nombre || 'No disponible'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Correo electrónico</p>
              <p className="text-lg font-medium text-slate-800">{currentUser?.correo || 'No disponible'}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Universidad</p>
              <p className="text-lg font-medium text-slate-800">{currentUser?.universidad || 'No disponible'}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Fecha de registro</p>
              <p className="text-lg font-medium text-slate-800">{currentUser?.fecha_registro || 'No disponible'}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Último acceso</p>
              <p className="text-lg font-medium text-slate-800">{currentUser?.ultimo_acceso || 'No disponible'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
