import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

const renderLogin = () => render(
  <AuthProvider>
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/simulacros" element={<p>Pantalla de simulacros</p>} />
      </Routes>
    </MemoryRouter>
  </AuthProvider>
);

const respuestaLogin = {
  mensaje: 'Login exitoso',
  usuario: { id_usuario: 1, nombre: 'Ana García', email: 'ana@example.com', universidad: 'ucsp' }
};

describe('Login', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('muestra el formulario de inicio de sesion', () => {
    // Arrange
    const campos = ['Correo electrónico', 'Contraseña'];

    // Act
    renderLogin();

    // Assert
    campos.forEach((campo) => expect(screen.getByPlaceholderText(campo)).toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Registrarse' })).toHaveAttribute('href', '/signup');
  });

  test('la pestaña Iniciar Sesión es un boton que no envia el formulario', () => {
    // Arrange
    renderLogin();

    // Act
    const [pestana, enviar] = screen.getAllByRole('button', { name: 'Iniciar Sesión' });

    // Assert
    expect(pestana).toHaveAttribute('type', 'button');
    expect(enviar).toHaveAttribute('type', 'submit');
  });

  test('quita el script de la escena 3D al desmontar', () => {
    // Arrange
    const { unmount } = renderLogin();
    expect(document.querySelector('script[src="/js/three-scene.js"]')).not.toBeNull();

    // Act
    unmount();

    // Assert
    expect(document.querySelector('script[src="/js/three-scene.js"]')).toBeNull();
  });

  test('un login correcto navega a simulacros sin escribir en console.log', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(respuestaLogin)
    }));
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    const usuario = userEvent.setup();
    renderLogin();
    await usuario.type(screen.getByPlaceholderText('Correo electrónico'), 'ana@example.com');
    await usuario.type(screen.getByPlaceholderText('Contraseña'), 'claveSegura1');

    // Act
    await usuario.click(screen.getAllByRole('button', { name: 'Iniciar Sesión' })[1]);

    // Assert
    expect(await screen.findByText('Pantalla de simulacros')).toBeInTheDocument();
    expect(consoleLog).not.toHaveBeenCalled();
  });
});
