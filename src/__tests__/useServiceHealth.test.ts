import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useServiceHealth } from '../hooks/useServiceHealth'

describe('useServiceHealth', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns "ok" when fetch succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const { result } = renderHook(() => useServiceHealth())

    // Let the initial check() promise settle
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })

    const values = Object.values(result.current)
    expect(values.some((v) => v === 'ok')).toBe(true)
  })

  it('returns "reachable" when fetch returns non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const { result } = renderHook(() => useServiceHealth())

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })

    const values = Object.values(result.current)
    expect(values.some((v) => v === 'reachable')).toBe(true)
  })

  it('returns "down" when all fetches fail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Network error')),
    )

    const { result } = renderHook(() => useServiceHealth())

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    const values = Object.values(result.current)
    expect(values.every((v) => v === 'down')).toBe(true)
  })
})
