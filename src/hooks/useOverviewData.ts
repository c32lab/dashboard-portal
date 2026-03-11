import { useEffect, useState } from 'react'
import { SIGNAL_API_URL, PREDICT_API_URL } from '../config'

export interface SignalHealth {
  status: string
  uptime_seconds: number
  active_symbols: number
}

export interface SignalAccuracy {
  windows: {
    '24h': { accuracy_1h_pct: number }
    '7d': { accuracy_1h_pct: number }
  }
}

export interface PredictHealth {
  status: string
  version: string
  uptime_seconds: number
}

export interface PredictDeep {
  status: string
  predictions_24h: { count_24h: number }
}

export interface OverviewData {
  signalHealth: SignalHealth | null
  signalAccuracy: SignalAccuracy | null
  predictHealth: PredictHealth | null
  predictDeep: PredictDeep | null
  isLoading: boolean
  errors: Record<string, string>
}

const INTERVAL_MS = 60_000

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useOverviewData(): OverviewData {
  const [data, setData] = useState<Omit<OverviewData, 'isLoading'>>({
    signalHealth: null,
    signalAccuracy: null,
    predictHealth: null,
    predictDeep: null,
    errors: {},
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchAll = async () => {
      const [sh, sa, ph, pd] = await Promise.allSettled([
        fetchJson<SignalHealth>(`${SIGNAL_API_URL}/api/health`),
        fetchJson<SignalAccuracy>(`${SIGNAL_API_URL}/api/accuracy/summary`),
        fetchJson<PredictHealth>(`${PREDICT_API_URL}/api/health`),
        fetchJson<PredictDeep>(`${PREDICT_API_URL}/api/health/deep`),
      ])

      if (cancelled) return

      const errors: Record<string, string> = {}
      if (sh.status === 'rejected') errors.signalHealth = sh.reason?.message ?? 'Failed'
      if (sa.status === 'rejected') errors.signalAccuracy = sa.reason?.message ?? 'Failed'
      if (ph.status === 'rejected') errors.predictHealth = ph.reason?.message ?? 'Failed'
      if (pd.status === 'rejected') errors.predictDeep = pd.reason?.message ?? 'Failed'

      setData({
        signalHealth: sh.status === 'fulfilled' ? sh.value : null,
        signalAccuracy: sa.status === 'fulfilled' ? sa.value : null,
        predictHealth: ph.status === 'fulfilled' ? ph.value : null,
        predictDeep: pd.status === 'fulfilled' ? pd.value : null,
        errors,
      })
      setIsLoading(false)
    }

    fetchAll()
    const id = setInterval(fetchAll, INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { ...data, isLoading }
}
