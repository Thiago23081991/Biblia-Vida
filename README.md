# Bíblia Viva & Adaptada

Aplicação web desenvolvida com React, Vite e Google Gemini AI para adaptar passagens bíblicas para diferentes públicos.

## 🚀 Configuração Local

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure a Chave de API:**
   Crie um arquivo chamado `.env` na raiz do projeto (ao lado do `package.json`) e adicione sua chave. É fundamental usar o prefixo `VITE_`.
   
   Conteúdo do arquivo `.env`:
   ```env
   VITE_API_KEY=Sua_Chave_Começada_Com_AIza_Aqui
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🌐 Deploy no Vercel (Obrigatório)

Para que o aplicativo funcione online, você precisa configurar a chave de API no painel da Vercel. O Vite só consegue ler variáveis que começam com `VITE_`.

1. Importe seu projeto do GitHub para o Vercel.
2. Vá em **Settings** (Configurações) > **Environment Variables** (Variáveis de Ambiente).
3. Adicione a variável:
   - **Key (Nome):** `VITE_API_KEY`
   - **Value (Valor):** `Sua chave da Google AI Studio`
4. Se o deploy já tinha falhado, vá em **Deployments**, clique no último deploy e selecione **Redeploy**.

⚠️ **Nota:** Se você usar apenas `API_KEY` ou `GOOGLE_API_KEY` sem o prefixo `VITE_`, o aplicativo **não funcionará**, pois o navegador não terá acesso à chave.

## 🛠 Tecnologias

- **React 19** & **Vite**: Performance e modernidade.
- **Google GenAI SDK**: Inteligência Artificial via Gemini 2.5 Flash.
- **Tailwind CSS**: Estilização rápida e responsiva.
- **Lucide React**: Ícones leves.
