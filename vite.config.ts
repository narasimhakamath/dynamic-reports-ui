import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/reports': {
        // target: 'https://dev.dfl.datanimbus.com',
        target: 'localhost:3000',
        changeOrigin: true,
      },
    },
  },
});