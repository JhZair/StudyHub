import React from 'react';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const Navbar = () => {
  // Check if user is logged in (you can replace this with your actual auth check)
  const isAuthenticated = false; // Change this based on your auth state

  return (
    <nav className="bg-[#07171D] flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-white font-bold text-2xl">StudyHub</Link>
      <div className="flex space-x-6 text-white">
        <Link to="/simulacros" className="hover:text-gray-400">Exámenes</Link>
        <a href="#" className="hover:text-gray-400">Recursos</a>
        <a href="#" className="hover:text-gray-400">Ranking</a>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <Link 
            to="/profile" 
            className="text-white hover:text-gray-400 flex items-center"
          >
            <UserOutlined className="mr-1" /> Mi Perfil
          </Link>
        ) : (
          <>
            <Link to="/login" className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200">
              Iniciar sesión
            </Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
