import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy: las llamadas a /api se redirigen al backend en :3000.
    // Así evitamos problemas de CORS en desarrollo y el frontend
    // no necesita saber la URL del backend (usa rutas relativas).
    proxy: {
      '/api': {
        target: 'https://backend-boda-production-4457.up.railway.app/',
        changeOrigin: true,
      },
    },
  },
});
