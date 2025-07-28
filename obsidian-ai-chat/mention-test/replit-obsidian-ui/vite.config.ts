import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: 'all'
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  define: {
    // Prevent Vite from trying to access process.env in browser
    'process.env': {},
  },
});