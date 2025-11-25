import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual
  // No GitHub Pages ou Vercel, defina VITE_API_KEY nas configurações do projeto
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: './', // Garante caminhos relativos para funcionar no GitHub Pages
    define: {
      // Polyfill para manter compatibilidade com o código existente que usa process.env
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  }
})