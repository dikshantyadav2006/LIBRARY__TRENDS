import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",  // <-- REQUIRED for Vercel SPA routing
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
