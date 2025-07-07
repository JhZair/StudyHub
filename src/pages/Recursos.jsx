import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Recursos() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);

  const BACKEND_URL = 'https://studyhubbackend-vdyi.onrender.com';
  

const fetchResources = async () => {
    try {
      const response = await fetch('https://studyhubbackend-vdyi.onrender.com/api/recursos', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recursos');
      }
      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchResources();
  }, []);

const handleUpload = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim() || !archivo) {
      alert('Por favor completa todos los campos y selecciona un archivo.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('archivo', archivo);
    formData.append('id_curso', 1);
    formData.append('id_usuario', 1);

    try {
      // const response = await axios.post('http://localhost:3000/api/recursos/upload', formData);
      const response = await axios.post(`https://studyhubbackend-vdyi.onrender.com/api/recursos/upload`, formData);
      console.log(response.data);
      if (response.data.success) {
        alert('Recurso subido con éxito');
        await fetchResources(); // aquí antes era cargarRecursos()
        setTitulo('');
        setDescripcion('');
        setArchivo(null);
      } else {
        alert('Error al subir recurso');
      }
    } catch (error) {
      console.error('Error al subir el recurso', error);
      alert('Error al subir recurso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // const response = await fetch('http://localhost:3000/api/recursos', {
        const response = await fetch('https://studyhubbackend-vdyi.onrender.com/api/recursos', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session authentication
        });
        if (!response.ok) {
          throw new Error('Failed to fetch resourceeeeeees');
        }
        const data = await response.json();
        setResources(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);


  return (
    <div className="bg-gray-100 font-sans relative overflow-x-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(45deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_10px,transparent_10px,transparent_20px)] before:z-[-1]">
      <Navbar />

      <main>
        <section className="p-5">
          <h2 className="bg-slate-900 text-white p-3 text-center m-0 mb-3 shadow-md rounded animate-slide-in">RECURSOS</h2>
          <p className="text-center text-sm text-gray-700 mb-5 italic">Explora cursos y exámenes resueltos para potenciar tu aprendizaje</p>

          {loading && (
            <div className="text-center text-gray-600">
              <p>Cargando recursos...</p>
              <div className="mt-2">
                <svg className="animate-spin h-8 w-8 text-slate-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && resources.length === 0 && (
            <div className="text-center text-gray-600">
              <p>Recursos</p>
            </div>
          )}

          {!loading && !error && resources.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
              {resources.map((resource) => (
                <div
                  key={resource.id_recurso}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{resource.titulo}</h3>
                  <p className="text-sm text-gray-600 mt-1">{resource.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tipo: <span className="font-medium">{resource.tipo}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Publicado: <span className="font-medium">{new Date(resource.fecha_publicacion).toLocaleDateString()}</span>
                  </p>
                 <a
                    href={`${BACKEND_URL}${resource.archivo.startsWith('/uploads/') ? '' : '/uploads/'}${resource.archivo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors"
                  >
                    Ver Recurso
                  </a>
                </div>
              ))}
            </div>
          )}
          <form
            onSubmit={handleUpload}
            className="mb-5 p-4 bg-white rounded shadow-md flex flex-col gap-2"
            encType="multipart/form-data"
          >
            <h3 className="font-semibold text-slate-900">Subir recurso</h3>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="border p-2 rounded text-black"
              required
            />
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border p-2 rounded text-black"
              required
            ></textarea>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="border p-2 rounded"
              required
            />
            {archivo && <p className="text-sm text-gray-600">Archivo seleccionado: {archivo.name}</p>}
            <input type="hidden" value="1" name="id_curso" />
            <input type="hidden" value="1" name="id_usuario" />
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subiendo...' : 'Subir recurso'}
            </button>
          </form>
        </section>
      </main>

      <footer className="bg-slate-900 text-white p-3 flex justify-between items-center shadow-[0_-2px_5px_rgba(0,0,0,0.3)] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:-left-full before:w-[200%] before:h-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] before:animate-wave">
        <div className="flex justify-between w-full z-[1]">
          <div className="p-1 hover:text-gray-200 transition-colors">ACERCA DE | CONTACTO</div>
        </div>
      </footer>
    </div>
  );
}