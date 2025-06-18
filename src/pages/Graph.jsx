import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Auth from '../components/Auth';
import Navbar from "../components/Navbar";

const Graph = () => {
  const { currentUser, logout } = useAuth();

  return (
        <div className="min-h-screen bg-gray-100 text-white flex flex-col">
        <Navbar />
      {/* Imagen del grafo */}
      <main className="flex items-center justify-center min-h-[calc(100vh-100px)] p-6">
        <img
          src="/rdf-grapher.png"
          alt="Grafo RDF"
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      </main>
    </div>
  );
};

export default Graph;
