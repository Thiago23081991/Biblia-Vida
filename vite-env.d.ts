// Manually define Vite types to avoid missing type definition error
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Polyfill for process.env as required by Google GenAI SDK guidelines
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
