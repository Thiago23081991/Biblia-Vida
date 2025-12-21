
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    // Mantemos process.env.API_KEY disponível, mas sem forçar um valor de build-time 
    // se ele não existir, deixando para o ambiente de execução.
    'process.env': process.env
  }
})
