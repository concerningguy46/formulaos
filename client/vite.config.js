import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const require = createRequire(import.meta.url)

process.env.NAPI_RS_FORCE_WASI = '1'
process.env.NAPI_RS_NATIVE_LIBRARY_PATH = require.resolve('@tailwindcss/oxide-wasm32-wasi')

const { default: tailwindcss } = await import('@tailwindcss/vite')

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
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
