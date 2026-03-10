/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SIGNAL_DASHBOARD_URL?: string
  readonly VITE_PREDICT_DASHBOARD_URL?: string
  readonly VITE_TRADING_DASHBOARD_URL?: string
  readonly VITE_SYSTEM_DASHBOARD_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
