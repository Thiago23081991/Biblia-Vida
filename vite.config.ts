
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // Deixamos o ambiente gerenciar process.env para garantir que 
  // chaves selecionadas via dialog sejam lidas corretamente.
})
