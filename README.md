
# Bíblia Viva & Adaptada

Aplicação web desenvolvida com React e Google Gemini AI para adaptar passagens bíblicas.

## 🚀 Como configurar a Chave de IA (Obrigatório)

Se você receber erros de conexão ou "Chave não encontrada", siga este guia passo a passo.

### 1. Criar sua Chave
1. Acesse: [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Clique em "Create API Key".

### 2. Configurar na Vercel (Passos Finais)
Vite injeta variáveis no **momento do build**. Se você apenas salvou a variável nas configurações, o site antigo ainda está sem a chave.

1. Vá no painel da **Vercel** -> **Settings** -> **Environment Variables**.
2. Adicione `VITE_API_KEY` com a sua chave.
3. **🚨 PASSO OBRIGATÓRIO:** Vá na aba **Deployments**.
4. Clique nos três pontinhos (`...`) à direita do seu último deploy (o que está no topo da lista).
5. Selecione **Redeploy**.
6. Aguarde o novo build terminar. Agora o código terá a chave injetada.

### 3. Rodando Localmente
1. Crie um arquivo `.env` na raiz.
2. Adicione: `VITE_API_KEY=sua_chave_aqui`
3. Execute `npm install` e `npm run dev`.

## 🛠 Tecnologias
- React 19 / Vite
- Google Gemini 3 Flash
- Tailwind CSS
- Lucide Icons
