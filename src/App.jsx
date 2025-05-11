import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terminal from './components/Terminal';
import AlertManager from './components/AlertManager';
import { signInWithGoogle } from './firebase/config';
import './tailwind.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message, duration = 5000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeAlert(id);
    }, duration);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <BrowserRouter>
      <AlertManager>
        <div className="h-screen overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto flex gap-8 bg-white p-4 rounded-lg shadow-lg">
            <div className="p-4 rounded-lg border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex-1">
            <div className="py-4 text-base leading-6 space-y-3 text-gray-700 sm:text-lg sm:leading-7">
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
                StudyHub
              </h1>
              <div className="flex justify-center mb-8">
                <button
                  className="flex items-center justify-center bg-white border border-gray-200 rounded-full p-3 hover:shadow-md transition-all duration-200 w-48 h-12"
                  onClick={async () => {
                    try {
                      const user = await signInWithGoogle();
                      addAlert('success', 'Inicio de sesión exitoso');
                    } catch (error) {
                      addAlert('error', error.message || 'Error al iniciar sesión');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Continuar con Google</span>
                  </div>
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <button
                    onClick={toggleForm}
                    className="toggle-form-button text-sm text-gray-900 hover:text-gray-600"
                  >
                    <i className="fas fa-exchange-alt"></i>
                    {showLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                  </button>
                </div>
                {showLogin ? <Login /> : <Signup />}
              </div>
            </div>
          </div>
          <div className="light-border p-4 rounded-lg border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Bienvenido a StudyHub</h2>
              <p className="text-gray-600">Descubre cómo StudyHub puede ayudarte a alcanzar tus metas académicas.</p>
              <div className="mt-6 flex justify-center">
                <Terminal />
              </div>
            </div>
            </div>
          </div>
        </div>
      </AlertManager>
    </BrowserRouter>
  );
}

export default App;