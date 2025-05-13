import React from 'react';

const Auth = () => {
  // Verificar si el usuario está autenticado
  const user = window.firebaseAuth?.currentUser;

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.firebaseAuth) {
      window.firebaseAuth.signOut().then(() => {
        window.location.reload();
      }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
    }
  };

  const redirectToLogin = (e) => {
    e.preventDefault();
    window.location.href = '/login.html';
  };

  const redirectToSignup = (e) => {
    e.preventDefault();
    window.location.href = '/signup.html';
  };

  return (
    <div className="flex gap-3">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-gray-200">
            Hola, {user.displayName || user.email || 'Usuario'}
          </span>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <>
          <a 
            href="/login.html"
            onClick={redirectToLogin}
            className="bg-transparent hover:bg-blue-600 text-blue-200 hover:text-white font-medium py-1.5 px-4 border border-blue-500 hover:border-transparent rounded text-sm"
          >
            Iniciar sesión
          </a>
          <a 
            href="/signup.html"
            onClick={redirectToSignup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded text-sm"
          >
            Registrarse
          </a>
        </>
      )}
    </div>
  );
};

export default Auth;
