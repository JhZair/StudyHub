import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const usuario = { id_usuario: 1, nombre: 'Ana García', correo: 'ana@example.com' };

// Muestra el usuario actual y entrega cada valor del contexto a `alRenderizar`
function Consumidor({ alRenderizar }) {
  const valor = useAuth();
  alRenderizar(valor);
  return <p>{valor.currentUser?.nombre ?? 'sin sesion'}</p>;
}

const renderConContexto = (alRenderizar) => render(
  <AuthProvider>
    <Consumidor alRenderizar={alRenderizar} />
  </AuthProvider>
);

describe('AuthContext', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('login guarda el usuario en localStorage y lo expone en currentUser', () => {
    // Arrange
    const alRenderizar = vi.fn();
    renderConContexto(alRenderizar);
    const { login } = alRenderizar.mock.lastCall[0];

    // Act
    act(() => login(usuario));

    // Assert
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('currentUser'))).toEqual(usuario);
  });

  test('logout borra el usuario de localStorage y de currentUser', () => {
    // Arrange
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    const alRenderizar = vi.fn();
    renderConContexto(alRenderizar);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    const { logout } = alRenderizar.mock.lastCall[0];

    // Act
    act(() => logout());

    // Assert
    expect(screen.getByText('sin sesion')).toBeInTheDocument();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  test('el valor del contexto conserva su identidad si el usuario no cambia', () => {
    // Arrange
    const alRenderizar = vi.fn();
    const { rerender } = renderConContexto(alRenderizar);
    const valorInicial = alRenderizar.mock.lastCall[0];

    // Act
    rerender(
      <AuthProvider>
        <Consumidor alRenderizar={alRenderizar} />
      </AuthProvider>
    );
    const valorFinal = alRenderizar.mock.lastCall[0];

    // Assert
    expect(alRenderizar.mock.calls.length).toBeGreaterThan(1);
    expect(valorFinal).toBe(valorInicial);
    expect(valorFinal.login).toBe(valorInicial.login);
    expect(valorFinal.logout).toBe(valorInicial.logout);
  });
});
