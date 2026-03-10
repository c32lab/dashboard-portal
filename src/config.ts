export interface TabConfig {
  label: string
  path: string
  src: string
  healthUrl: string
}

const SIGNAL_URL =
  import.meta.env.VITE_SIGNAL_DASHBOARD_URL || 'http://localhost:3080'
const PREDICT_URL =
  import.meta.env.VITE_PREDICT_DASHBOARD_URL || 'http://localhost:18828'

export const DASHBOARD_URLS = {
  signal: SIGNAL_URL,
  predict: PREDICT_URL,
  trading:
    import.meta.env.VITE_TRADING_DASHBOARD_URL || `${SIGNAL_URL}/trading`,
  system:
    import.meta.env.VITE_SYSTEM_DASHBOARD_URL ||
    `${SIGNAL_URL}/advanced/system`,
}

export const TAB_CONFIG: TabConfig[] = [
  {
    label: 'Signal',
    path: '/signal',
    src: DASHBOARD_URLS.signal,
    healthUrl: SIGNAL_URL,
  },
  {
    label: 'Predict',
    path: '/predict',
    src: DASHBOARD_URLS.predict,
    healthUrl: PREDICT_URL,
  },
  {
    label: 'Trading',
    path: '/trading',
    src: DASHBOARD_URLS.trading,
    healthUrl: SIGNAL_URL,
  },
  {
    label: 'System',
    path: '/system',
    src: DASHBOARD_URLS.system,
    healthUrl: SIGNAL_URL,
  },
]
