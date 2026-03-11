import { useNavigate } from 'react-router-dom'
import { TAB_CONFIG } from '../config'
import { useOverviewData } from '../hooks/useOverviewData'

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`}
    />
  )
}

export default function OverviewPage() {
  const { signalHealth, signalAccuracy, predictHealth, predictDeep, isLoading, errors } =
    useOverviewData()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    )
  }

  const acc24h = signalAccuracy?.windows['24h']?.accuracy_1h_pct ?? null
  const acc7d = signalAccuracy?.windows['7d']?.accuracy_1h_pct ?? null
  const accDelta = acc24h !== null && acc7d !== null ? acc24h - acc7d : null

  const count24h = predictDeep?.predictions_24h?.count_24h ?? null

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-white text-xl font-semibold mb-6">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {/* Signal Service */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <StatusDot ok={!errors.signalHealth && signalHealth?.status === 'ok'} />
            <h3 className="text-white font-medium">Signal Service</h3>
          </div>
          {signalHealth ? (
            <div className="space-y-1 text-sm text-gray-400">
              <p>Active Symbols: <span className="text-white">{signalHealth.active_symbols}</span></p>
              <p>Uptime: <span className="text-white">{formatUptime(signalHealth.uptime_seconds)}</span></p>
            </div>
          ) : (
            <p className="text-sm text-red-400">Unavailable</p>
          )}
        </div>

        {/* Signal Accuracy */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <StatusDot ok={!errors.signalAccuracy && acc24h !== null} />
            <h3 className="text-white font-medium">Signal Accuracy</h3>
          </div>
          {acc24h !== null ? (
            <div className="space-y-1 text-sm text-gray-400">
              <p>
                24h Accuracy:{' '}
                <span className="text-white">{acc24h.toFixed(1)}%</span>
              </p>
              {accDelta !== null && (
                <p>
                  vs 7d:{' '}
                  <span className={accDelta >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {accDelta >= 0 ? '\u2191' : '\u2193'} {Math.abs(accDelta).toFixed(1)}%
                  </span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-400">Unavailable</p>
          )}
        </div>

        {/* Predict Service */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <StatusDot ok={!errors.predictHealth && predictHealth?.status === 'ok'} />
            <h3 className="text-white font-medium">Predict Service</h3>
          </div>
          {predictHealth ? (
            <div className="space-y-1 text-sm text-gray-400">
              <p>Version: <span className="text-white">{predictHealth.version}</span></p>
              <p>Uptime: <span className="text-white">{formatUptime(predictHealth.uptime_seconds)}</span></p>
            </div>
          ) : (
            <p className="text-sm text-red-400">Unavailable</p>
          )}
        </div>

        {/* Predictions */}
        <div
          className={`bg-gray-900 border rounded-lg p-5 ${
            count24h === 0 ? 'border-red-700' : 'border-gray-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <StatusDot ok={!errors.predictDeep && count24h !== null && count24h > 0} />
            <h3 className="text-white font-medium">Predictions</h3>
          </div>
          {count24h !== null ? (
            <div className="space-y-1 text-sm text-gray-400">
              <p>
                Last 24h:{' '}
                <span className={count24h === 0 ? 'text-red-400' : 'text-white'}>
                  {count24h}
                </span>
              </p>
              {count24h === 0 && (
                <p className="text-red-400">No predictions in the last 24 hours</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-400">Unavailable</p>
          )}
        </div>
      </div>

      {/* Dashboard Links */}
      <div className="mt-8 max-w-4xl">
        <h3 className="text-gray-400 text-sm font-medium mb-3">Dashboards</h3>
        <div className="flex flex-wrap gap-2">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
