import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#07171D] flex items-center justify-between px-6 py-4">
      <div className="text-white font-bold text-2xl">StudyHub</div>
      <div className="flex space-x-6 text-white">
        <a href="#" className="hover:text-gray-400">Exámenes</a>
        <a href="#" className="hover:text-gray-400">Recursos</a>
        <a href="#" className="hover:text-gray-400">Ranking</a>
      </div>
      <div className="flex space-x-4">
        <button className="bg-white text-black px-4 py-1 rounded">log in</button>
        <button className="bg-white text-black px-4 py-1 rounded">sign up</button>
      </div>
    </nav>
  );
};

export default Navbar;
