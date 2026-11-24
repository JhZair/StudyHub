import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  test.each([
    ['Contraseña', 'contraseña'],
    ['Confirmar Contraseña', 'confirmación de contraseña']
  ])('el boton de %s alterna el input entre password y text', async (placeholder, campo) => {
    // Arrange
    const usuario = userEvent.setup();
    renderSignup();
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toHaveAttribute('type', 'password');

    // Act
    await usuario.click(screen.getByRole('button', { name: `Mostrar ${campo}` }));
    const tipoVisible = input.getAttribute('type');
    await usuario.click(screen.getByRole('button', { name: `Ocultar ${campo}` }));

    // Assert
    expect(tipoVisible).toBe('text');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('los botones de mostrar contraseña no envian el formulario', () => {
    // Arrange
    renderSignup();

    // Act
    const botones = [
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
      screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' })
    ];

    // Assert
    botones.forEach((boton) => expect(boton).toHaveAttribute('type', 'button'));
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
