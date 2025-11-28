interface ImportMetaEnv {
  readonly VITE_CT_PROJECT_KEY: string
  readonly VITE_CT_API_URL: string
  readonly VITE_CT_AUTH_URL: string
  readonly VITE_CT_CLIENT_ID: string
  readonly VITE_CT_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
