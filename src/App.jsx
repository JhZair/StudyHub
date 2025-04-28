function App() {
  return (
    <div className="text-white text-center p-8 max-w-2xl">
      <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">StudyHub</h1>
      <p className="text-xl mb-8">Tu plataforma para estudiar de forma inteligente 📚</p>
      <div className="flex justify-center space-x-4">
        <button className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-gray-100 transition">Comenzar</button>
        <button className="border border-white py-3 px-6 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition">Saber más</button>
      </div>
    </div>
  )
}

export default App
