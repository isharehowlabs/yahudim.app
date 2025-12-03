import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: false,
  },
  css: {
    devSourcemap: true,
  },
  server: {
    port: 3000,
    // Remove proxy when connecting to remote backend
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //   },
    //   '/health': {
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //   }
    // }
  }
})
