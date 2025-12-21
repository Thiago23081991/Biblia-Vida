
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    // Usamos um fallback para string vazia para evitar erro de 'process is not defined'
    // mas garantimos que a propriedade API_KEY seja mapeada.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
})
