
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo (dev ou prod)
  // Fix: Cast process to any to resolve the "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: '/',
    define: {
      // Isso mapeia o process.env.API_KEY usado no código para a variável configurada no ambiente
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || '')
    }
  }
})
