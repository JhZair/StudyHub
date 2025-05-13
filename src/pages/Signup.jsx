import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la página de registro con el diseño del planeta giratorio
    window.location.href = '/signup.html';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <p>Redirigiendo al formulario de registro...</p>
      </div>
    </div>
  );
}
