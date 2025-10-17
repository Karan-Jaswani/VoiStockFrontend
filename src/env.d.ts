/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VOISTOCK_API_URL: string;
  // add other env vars here as readonly strings
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
