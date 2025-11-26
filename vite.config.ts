import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel and GitHub Pages handle paths differently, but ./ is generally safe for static assets
  base: './', 
})