import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from '../context/AuthContext';
import Profile from './Profile';

vi.mock('axios');

const usuarioGuardado = {
  id_usuario: 1,
  nombre: 'Ana García',
  correo: 'ana@example.com',
  universidad: 'ucsp',
  fecha_registro: '2026-11-01T10:00:00.000Z',
  ultimo_acceso: '2026-11-20T10:00:00.000Z'
};

const renderProfile = () => render(
  <AuthProvider>
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  </AuthProvider>
);

describe('Profile', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('muestra los datos del usuario con sesion', async () => {
    // Arrange
    localStorage.setItem('currentUser', JSON.stringify(usuarioGuardado));
    axios.get.mockResolvedValue({ data: [] });

    // Act
    renderProfile();

    // Assert
    expect(screen.getByRole('heading', { name: 'Mi Perfil' })).toBeInTheDocument();
    expect(await screen.findByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByText('ucsp')).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/puntajes/usuario/1'));
  });

  test('sin sesion muestra No disponible y no consulta puntajes', () => {
    // Arrange
    localStorage.removeItem('currentUser');

    // Act
    renderProfile();

    // Assert
    expect(screen.getAllByText('No disponible')).toHaveLength(5);
    expect(axios.get).not.toHaveBeenCalled();
  });
});
