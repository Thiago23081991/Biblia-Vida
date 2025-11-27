# Bíblia Viva & Adaptada

Aplicação web desenvolvida com React, Vite e Google Gemini AI para adaptar passagens bíblicas para diferentes públicos.

## Configuração Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto e adicione sua chave:
   ```env
   VITE_API_KEY=Sua_Chave_Gemini_Aqui
   ```
   *Nota: A chave deve começar com `VITE_` para funcionar.*

3. Rode o projeto:
   ```bash
   npm run dev
   ```

## Deploy no Vercel (Importante)

Ao fazer o deploy no Vercel, você **deve** configurar a variável de ambiente corretamente:

1. Vá em **Settings** > **Environment Variables**.
2. Adicione a variável:
   - **Name:** `VITE_API_KEY`
   - **Value:** `(Sua chave API do Google AI Studio)`
3. Faça um novo deploy.

Se você usar o nome `API_KEY` (sem VITE_), o aplicativo **não funcionará**, pois o Vite não expõe variáveis de ambiente padrão para o navegador por segurança.
