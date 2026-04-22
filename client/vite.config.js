import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

process.env.NAPI_RS_FORCE_WASI = '1'
const { default: tailwindcss } = await import('@tailwindcss/vite')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
