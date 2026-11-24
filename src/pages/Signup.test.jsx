import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';

const renderSignup = () => render(
  <MemoryRouter>
    <Signup />
  </MemoryRouter>
);

describe('Signup', () => {
  test('muestra el formulario de registro', () => {
    // Arrange
    const campos = ['Nombre completo', 'Correo electrónico', 'Contraseña', 'Confirmar Contraseña'];

    // Act
    renderSignup();

    // Assert
    campos.forEach((campo) => expect(screen.getByPlaceholderText(campo)).toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Iniciar Sesión' })).toHaveAttribute('href', '/login');
  });

  test('la pestaña Registrarse es un boton que no envia el formulario', () => {
    // Arrange
    renderSignup();

    // Act
    const [pestana, enviar] = screen.getAllByRole('button', { name: 'Registrarse' });

    // Assert
    expect(pestana).toHaveAttribute('type', 'button');
    expect(enviar).toHaveAttribute('type', 'submit');
  });

  test('quita el script de la escena 3D al desmontar', () => {
    // Arrange
    const { unmount } = renderSignup();
    expect(document.querySelector('script[src="/js/three-scene.js"]')).not.toBeNull();

    // Act
    unmount();

    // Assert
    expect(document.querySelector('script[src="/js/three-scene.js"]')).toBeNull();
  });
});
