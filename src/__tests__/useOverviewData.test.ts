import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useOverviewData } from '../hooks/useOverviewData'

const mockSignalHealth = { status: 'ok', uptime_seconds: 3600, active_symbols: 42 }
const mockSignalAccuracy = {
  windows: {
    '24h': { accuracy_1h_pct: 72.5 },
    '7d': { accuracy_1h_pct: 68.3 },
  },
}
const mockPredictHealth = { status: 'ok', version: '1.2.0', uptime_seconds: 7200 }
const mockPredictDeep = { status: 'ok', predictions_24h: { count_24h: 150 } }

function mockFetchSuccess() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/health/deep'))
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPredictDeep) })
      if (url.includes('/api/health') && url.includes('18801'))
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPredictHealth) })
      if (url.includes('/api/accuracy/summary'))
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSignalAccuracy) })
      if (url.includes('/api/health'))
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSignalHealth) })
      return Promise.reject(new Error('Unknown URL'))
    }),
  )
}

describe('useOverviewData', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches all data successfully', async () => {
    mockFetchSuccess()

    const { result } = renderHook(() => useOverviewData())

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.signalHealth).toEqual(mockSignalHealth)
    expect(result.current.signalAccuracy).toEqual(mockSignalAccuracy)
    expect(result.current.predictHealth).toEqual(mockPredictHealth)
    expect(result.current.predictDeep).toEqual(mockPredictDeep)
    expect(Object.keys(result.current.errors)).toHaveLength(0)
  })

  it('handles partial failures gracefully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/health') && url.includes('18810'))
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSignalHealth) })
        return Promise.reject(new TypeError('Network error'))
      }),
    )

    const { result } = renderHook(() => useOverviewData())

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.signalHealth).toEqual(mockSignalHealth)
    expect(result.current.signalAccuracy).toBeNull()
    expect(result.current.predictHealth).toBeNull()
    expect(result.current.predictDeep).toBeNull()
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
  })

  it('handles all endpoints failing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Network error')),
    )

    const { result } = renderHook(() => useOverviewData())

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.signalHealth).toBeNull()
    expect(result.current.signalAccuracy).toBeNull()
    expect(result.current.predictHealth).toBeNull()
    expect(result.current.predictDeep).toBeNull()
    expect(Object.keys(result.current.errors)).toHaveLength(4)
  })
})
