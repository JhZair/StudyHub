import React, { useEffect, useState } from 'react';
   import { useNavigate } from 'react-router-dom';

   export default function Recursos() {
     const navigate = useNavigate();
     const [resources, setResources] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       const fetchResources = async () => {
         try {
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
         <header className="bg-slate-900 p-6 flex items-center justify-between shadow-md text-white">
           <div className="flex items-center gap-10 ml-2">
             <a href="/" className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform">StudyHub</a>
           </div>
           <div className="flex gap-4 mr-2 font-medium">
             <a href="/simulacros" className="hover:underline">Simulacros</a>
           </div>
         </header>

         <main>
           <section className="p-5">
             <h2 className="bg-slate-900 text-white p-3 text-center m-0 mb-3 shadow-md rounded animate-slide-in">RECURSOS</h2>
             <p className="text-center text-sm text-gray-700 mb-5 italic">Explora cursos y exámenes resueltos para potenciar tu aprendizaje</p>

             {loading && (
               <div className="text-center text-gray-600">
                 <p>Loading resources... This may take up to 30 seconds.</p>
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
                 <p>No resources available.</p>
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
                       href={resource.archivo}
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