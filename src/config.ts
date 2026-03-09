export interface TabConfig {
  label: string
  path: string
  src: string
  healthUrl: string
}

const SIGNAL_URL =
  import.meta.env.VITE_SIGNAL_URL || 'http://localhost:3080'
const PREDICT_URL =
  import.meta.env.VITE_PREDICT_URL || 'http://localhost:18828'

export const TAB_CONFIG: TabConfig[] = [
  {
    label: 'Signal',
    path: '/signal',
    src: SIGNAL_URL,
    healthUrl: SIGNAL_URL,
  },
  {
    label: 'Predict',
    path: '/predict',
    src: PREDICT_URL,
    healthUrl: PREDICT_URL,
  },
  {
    label: 'Trading',
    path: '/trading',
    src: `${SIGNAL_URL}/trading`,
    healthUrl: SIGNAL_URL,
  },
  {
    label: 'System',
    path: '/system',
    src: `${SIGNAL_URL}/advanced/system`,
    healthUrl: SIGNAL_URL,
  },
]
