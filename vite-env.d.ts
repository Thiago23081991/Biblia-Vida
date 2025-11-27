declare var process: {
  env: {
    API_KEY: string;
  }
};

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
