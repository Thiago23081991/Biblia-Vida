
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // Removemos a definição estática de 'process.env.API_KEY' para não sobrescrever
  // a injeção em tempo de execução da plataforma com uma string vazia do build.
})
