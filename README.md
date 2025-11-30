# Bíblia Viva & Adaptada

Aplicação web desenvolvida com React, Vite e Google Gemini AI para adaptar passagens bíblicas para diferentes públicos.

## 🚀 Como Configurar (Essencial)

Esta aplicação requer uma **API Key** do Google Gemini para funcionar.

### 1. Obter a Chave
1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Crie uma nova chave de API.

### 2. Rodando no seu PC (Local)
1. Crie um arquivo `.env` na raiz do projeto.
2. Adicione a chave com o prefixo `VITE_`:
   ```env
   VITE_API_KEY=Cole_Sua_Chave_Aqui
   ```
3. Rode `npm install` e depois `npm run dev`.

### 3. Deploy na Vercel (Online)
Para o site funcionar na internet, você **DEVE** configurar a variável no painel da Vercel:

1. Vá em **Settings** > **Environment Variables**.
2. Adicione:
   - **Key:** `VITE_API_KEY`  ⚠️ (Obrigatório ter o VITE_)
   - **Value:** `Sua_Chave_Aqui`
3. Faça um novo deploy.

## 🛠 Tecnologias

- **React 19** & **Vite**: Performance e modernidade.
- **Google GenAI SDK**: Inteligência Artificial via Gemini 2.5 Flash.
- **Tailwind CSS**: Estilização rápida e responsiva.