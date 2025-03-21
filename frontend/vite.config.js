import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get API URL from .env file or fallback to the Render deployment
const apiUrl = process.env.VITE_API_URL || 'https://ajay-portfolio-017w.onrender.com'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,  // Don't rewrite paths
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy server error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying:', req.method, req.url, 'to', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', {
              status: proxyRes.statusCode,
              url: req.url,
              method: req.method,
            });
          });
        },
      },
      '/uploads': {
        target: apiUrl,
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    // Make environment variables available at build time
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || apiUrl),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
})
