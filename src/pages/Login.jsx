import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/three-scene.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://studyhubbackend-vdyi.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const text = await res.text(); // Intenta primero leer como texto
      let data;

      try {
        data = JSON.parse(text); // Intenta convertir a JSON
      } catch (parseError) {
        console.error('No se pudo parsear respuesta como JSON:', text);
        setError('Respuesta inválida del servidor');
        return;
      }

      console.log(data); // Verifica estructura

      if (res.ok) {
        const userData = data.usuario;

        const user = {
          id_usuario: userData.id_usuario,
          nombre: userData.nombre,
          correo: userData.email ,
          universidad: userData.universidad,
          fecha_registro: userData.fecha_registro,
          ultimo_acceso: userData.ultimo_acceso
        };

        login(user);
        navigate('/simulacros');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de red:', err);
      setError('Error de red');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-box">
          <h1 className="welcome-title">Bienvenido a StudyHub</h1>
          <div className="divider"></div>
          <div className="form-toggle">
            <button className="toggle-btn active">Iniciar Sesión</button>
            <a href="/signup" className="toggle-btn">Registrarse</a>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
            </div>
            <div className="input-group">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" id="password" required />
            </div>
            <button type="submit" className="submit-btn">Iniciar Sesión</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
      <div id="canvas-container"></div>
    </div>
  );
};

export default Login;
