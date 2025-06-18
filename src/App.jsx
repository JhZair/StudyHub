import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Simulacros from "./pages/Simulacros";
import Examen from "./pages/Examen";
import Recursos from "./pages/Recursos";
import Profile from "./pages/Profile";
import Graph from "./pages/Graph";
import ExamenTrivia from "./pages/ExamenTrivia";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
                <Login />
            } 
          />
          <Route 
            path="/signup" 
            element={
                <Signup />
            } 
          />
          <Route 
            path="/simulacros" 
            element={
                <Simulacros />
            } 
          />
          <Route 
            path="/simulacros/:cursoSlug" 
            element={
                <Examen />
            } 
          />
          <Route 
          path="/perfil" 
          element={
              <Profile />
          } 
          />
            <Route 
            path="/recursos" 
            element={
                <Recursos />
            } 
          />
            <Route 
            path="/grafo" 
            element={
                <Graph />
            } 
          />
          <Route path="/simulacros/trivia" element={<ExamenTrivia />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}