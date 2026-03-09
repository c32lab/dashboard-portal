import { useEffect, useState } from 'react'
import { TAB_CONFIG } from '../config'

export type HealthStatus = 'ok' | 'reachable' | 'down'

const INTERVAL_MS = 30_000

async function checkUrl(url: string): Promise<HealthStatus> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    return res.ok ? 'ok' : 'reachable'
  } catch {
    // CORS or network error — try opaque request to test connectivity
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store' })
      return 'reachable'
    } catch {
      return 'down'
    }
  }
}

export function useServiceHealth(): Record<string, HealthStatus> {
  const urls = [...new Set(TAB_CONFIG.map((t) => t.healthUrl))]
  const [status, setStatus] = useState<Record<string, HealthStatus>>(() =>
    Object.fromEntries(urls.map((u) => [u, 'down' as HealthStatus])),
  )

  useEffect(() => {
    const check = async () => {
      const results = await Promise.all(
        urls.map(async (url) => [url, await checkUrl(url)] as const),
      )
      setStatus(Object.fromEntries(results))
    }

    check()
    const id = setInterval(check, INTERVAL_MS)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return status
}
