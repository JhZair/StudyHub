import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la página de login con el diseño del planeta giratorio
    window.location.href = '/login.html';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <p>Redirigiendo al formulario de inicio de sesión...</p>
      </div>
    </div>
  );
}
