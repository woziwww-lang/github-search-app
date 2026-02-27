import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external access (mobile devices and simulators)
    port: 5173,
    strictPort: false,
    open: false,
    cors: true, // Enable CORS
    hmr: {
      host: 'localhost', // HMR uses localhost
      clientPort: 5173,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
  },
})
