export interface TabConfig {
  label: string
  path: string
  src: string
  healthUrl: string
}

// Trailing slash required for iframe src (relative asset path resolution)
const SIGNAL_URL =
  import.meta.env.VITE_SIGNAL_DASHBOARD_URL || '/signal/'
const PREDICT_URL =
  import.meta.env.VITE_PREDICT_DASHBOARD_URL || '/predict/'

// No trailing slash for API fetch URLs (concatenated with /api/...)
export const SIGNAL_API_URL =
  import.meta.env.VITE_SIGNAL_API_URL || '/signal'
export const PREDICT_API_URL =
  import.meta.env.VITE_PREDICT_API_URL || '/predict'

export const DASHBOARD_URLS = {
  signal: SIGNAL_URL,
  predict: PREDICT_URL,
  trading:
    import.meta.env.VITE_TRADING_DASHBOARD_URL || `${SIGNAL_URL}trading`,
  system:
    import.meta.env.VITE_SYSTEM_DASHBOARD_URL ||
    `${SIGNAL_URL}advanced/system`,
}

export const TAB_CONFIG: TabConfig[] = [
  {
    label: 'Signal',
    path: '/view/signal',
    src: DASHBOARD_URLS.signal,
    healthUrl: SIGNAL_API_URL,
  },
  {
    label: 'Predict',
    path: '/view/predict',
    src: DASHBOARD_URLS.predict,
    healthUrl: PREDICT_API_URL,
  },
  {
    label: 'Trading',
    path: '/view/trading',
    src: DASHBOARD_URLS.trading,
    healthUrl: SIGNAL_API_URL,
  },
  {
    label: 'System',
    path: '/view/system',
    src: DASHBOARD_URLS.system,
    healthUrl: SIGNAL_API_URL,
  },
]
