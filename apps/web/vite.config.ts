import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Lokalnie: `npm run dev:api` w drugim terminalu (port 3000).
    proxy: {
      '/api': process.env.API_URL ?? 'http://localhost:3000',
    },
  },
});
