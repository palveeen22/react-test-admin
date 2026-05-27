import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/c300': {
        target: 'https://showroom.eis24.me',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
