/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
