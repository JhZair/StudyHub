import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Simulacros from "./pages/Simulacros";
import Examen from "./pages/Examen";
import { useAuth } from "./context/AuthContext";

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Componente para redirigir usuarios autenticados lejos de las páginas de autenticación
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/simulacros" 
          element={
            <PrivateRoute>
              <Simulacros />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/simulacros/:cursoSlug" 
          element={
            <PrivateRoute>
              <Examen />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}