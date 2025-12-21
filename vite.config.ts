
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis do arquivo .env ou do sistema (Vercel)
  // O terceiro parâmetro '' permite carregar variáveis sem o prefixo VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Captura a chave de várias fontes possíveis para evitar erro de 'undefined'
  const apiKey = env.VITE_API_KEY || env.API_KEY || '';

  return {
    plugins: [react()],
    base: '/',
    define: {
      // Substitui fisicamente a string 'process.env.API_KEY' no código final pelo valor da chave
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})
