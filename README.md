
# Bíblia Viva & Adaptada

Aplicação web desenvolvida com React e Google Gemini AI para adaptar passagens bíblicas.

## 🚀 Como configurar a Chave de IA (Obrigatório)

O aplicativo precisa de uma chave da Google para funcionar.

### 1. Criar sua Chave
1. Acesse: [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Clique em "Create API Key".

### 2. Configurar na Vercel (Para o site online)
Se o seu site já está na Vercel, siga estes passos:
1. Abra o painel do seu projeto na **Vercel**.
2. Vá na aba **Settings** (Configurações).
3. Clique em **Environment Variables** (Variáveis de Ambiente) na lateral esquerda.
4. Adicione uma nova variável:
   - **Key:** `VITE_API_KEY`
   - **Value:** (Cole aqui a chave que você criou no Google)
5. Clique em **Save**.
6. **IMPORTANTE:** Vá na aba **Deployments**, clique nos três pontinhos do último deploy e selecione **Redeploy** para aplicar a nova chave.

### 3. Rodando Localmente (No computador)
1. Crie um arquivo `.env` na pasta raiz.
2. Adicione: `VITE_API_KEY=sua_chave_aqui`
3. Execute `npm install` e `npm run dev`.

## 🛠 Tecnologias
- React 19 / Vite
- Google Gemini 2.0 Flash
- Tailwind CSS
- Lucide Icons
