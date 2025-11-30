import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    // This allows the code to use process.env.API_KEY (as required by strict guidelines)
    // while actually pulling the value from Vite's import.meta.env.VITE_API_KEY
    'process.env.API_KEY': 'import.meta.env.VITE_API_KEY'
  }
})