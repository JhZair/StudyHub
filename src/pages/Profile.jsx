import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Auth from '../components/Auth';
import Navbar from "../components/Navbar";

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
    <Navbar />
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
