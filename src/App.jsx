import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Simulacros from "./pages/Simulacros";
import Examen from "./pages/Examen";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulacros" element={<Simulacros />} />
        <Route path="/simulacros/:curso" element={<Examen />} />
      </Routes>
    </Router>
  );
}