import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Application Error:", error);
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; items-center; justify-content: center; height: 100vh; text-align: center; font-family: sans-serif; padding: 20px; background-color: #fef2f2; color: #991b1b;">
      <h1 style="font-size: 24px; margin-bottom: 10px;">Ops! Ocorreu um erro ao carregar o aplicativo.</h1>
      <p style="font-size: 16px;">Tente recarregar a página ou limpar o cache do navegador.</p>
      <pre style="margin-top: 20px; background: #fff; padding: 10px; border-radius: 5px; overflow: auto; max-width: 800px; margin-left: auto; margin-right: auto; text-align: left;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}