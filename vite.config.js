import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import apiServer from './api/index.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(devServer) {
        devServer.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/api') || req.url.startsWith('/jobs') || req.url.startsWith('/applications') || req.url.startsWith('/websiteSettings'))) {
            return apiServer(req, res, next);
          }
          next();
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
});
