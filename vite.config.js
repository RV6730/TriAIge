import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/socket.io': {
        target: 'http://127.0.0.1:8000',
        ws: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
})