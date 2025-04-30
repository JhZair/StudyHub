function Landing() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-20 space-y-10">
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
        Bienvenido a <span className="text-pink-400">StudyHub</span>
      </h1>
      <p className="max-w-2xl text-lg md:text-xl text-gray-300">
        Practica con simulacros, estudia con recursos de calidad y compite para alcanzar el mejor ranking.
      </p>
      <div className="space-x-4">
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full transition">
          Empezar a practicar
        </button>
        <button className="bg-transparent border-2 border-pink-400 hover:bg-pink-400 hover:text-white text-pink-400 font-bold py-3 px-6 rounded-full transition">
          Ver Recursos
        </button>
      </div>
    </section>
  );
}

export default Landing;
