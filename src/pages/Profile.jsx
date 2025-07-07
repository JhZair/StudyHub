import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/Navbar";

const Profile = () => {
  const { currentUser } = useAuth();

  const [puntajes, setPuntajes] = useState([]);

useEffect(() => {
  const obtenerPuntajes = async () => {
    try {
      const response = await axios.get(`https://studyhubbackend-vdyi.onrender.com/api/puntajes/usuario/${currentUser.id_usuario}`);
      setPuntajes(response.data);
    } catch (error) {
      console.error('Error al obtener puntajes:', error);
    }
  };

  if (currentUser?.id_usuario) {
    obtenerPuntajes();
  }
}, [currentUser]);

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

            {puntajes.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Mis Puntajes</h2>
                <div className="space-y-4">
                  {puntajes.map((puntaje) => (
                    <div key={puntaje.id_examen} className="p-4 bg-gray-50 rounded shadow">
                      <p className="text-gray-600 font-semibold">{puntaje.nombre_curso}</p>
                      <p className="text-gray-600">Puntaje: {puntaje.puntaje} / {puntaje.preguntas}</p>
                      <p className="text-gray-600">Duración: {puntaje.duracion} min</p>
                      <p className="text-gray-600 text-sm">Fecha: {new Date(puntaje.fecha_realizacion).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
