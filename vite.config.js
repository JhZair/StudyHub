import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Configuración para servir archivos estáticos desde la carpeta public
    // y permitir el enrutamiento de SPA para rutas no encontradas
    historyApiFallback: true,
  },
  // Configuración para copiar archivos HTML estáticos a la carpeta de salida
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        login: './public/login.html',
        signup: './public/signup.html',
      },
    },
  },
});
