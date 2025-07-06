import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

const Signup = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/three-scene.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, universidad: 'ucsp', password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registro exitoso. Ahora inicia sesión.');
        navigate('/login');
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch (err) {
      console.error(err);
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
            <a href="/login" className="toggle-btn">Iniciar Sesión</a>
            <button className="toggle-btn active">Registrarse</button>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" required />
            </div>
            <div className="input-group">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
            </div>
            <div className="input-group">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
            <div className="input-group">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar Contraseña" required />
              <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
            <button type="submit" className="submit-btn">Registrarse</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
      <div id="canvas-container"></div>
    </div>
  );
};

export default Signup;
