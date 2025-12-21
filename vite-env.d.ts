
// Fix: Removed problematic vite/client reference as it's not found in this environment
// Fix: Use the AIStudio interface for window.aistudio to match internal type expectations

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string | undefined;
    }
  }
}

// Necessário para tratar o arquivo como módulo
export {};
