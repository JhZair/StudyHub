import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import Landing from '../components/Landing';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

describe('Pruebas de Renderizado Frontend (Issue #40)', () => {
    test('debe renderizar Navbar sin errores de botones', () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            </AuthProvider>
        );

        // Si existen elementos <button> en el Navbar (ej. al estar logueado o menú), verificamos que tengan type="button"
        const botones = screen.queryAllByRole('button');
        botones.forEach(boton => {
            expect(boton).toHaveAttribute('type', 'button');
        });

        // Verificamos que el Navbar se renderizó correctamente buscando el título/brand
        expect(screen.getByText('StudyHub')).toBeDefined();
    });

    test('debe renderizar el componente Landing sin errores y verificar sus botones', () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        const botones = screen.queryAllByRole('button');
        botones.forEach(boton => {
            expect(boton).toHaveAttribute('type', 'button');
        });

        expect(document.body).toBeDefined();
    });
});