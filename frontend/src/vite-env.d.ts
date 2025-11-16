/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
