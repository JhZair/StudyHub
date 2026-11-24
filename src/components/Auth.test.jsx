import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Auth from './Auth';

describe('Auth', () => {
  test('muestra los enlaces de login y registro', () => {
    // Arrange
    const ui = (
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );

    // Act
    render(ui);

    // Assert
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/signup');
  });
});
