import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'
import OverviewPage from '../components/OverviewPage'

const mockSignalHealth = { status: 'ok', uptime_seconds: 3600, active_symbols: 42 }
const mockSignalAccuracy = {
  windows: {
    '24h': { accuracy_1h_pct: 72.5 },
    '7d': { accuracy_1h_pct: 68.3 },
  },
}
const mockPredictHealth = { status: 'ok', version: '1.2.0', uptime_seconds: 7200 }
const mockPredictDeep = { status: 'ok', predictions_24h: { count_24h: 150 } }

function mockFetchAll() {
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

async function waitForLoad() {
  await vi.waitFor(() => {
    expect(screen.queryByText('Loading...')).toBeNull()
  })
}

describe('OverviewPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders all cards with data', async () => {
    mockFetchAll()

    render(
      <MemoryRouter>
        <OverviewPage />
      </MemoryRouter>,
    )

    await waitForLoad()

    expect(screen.getByText('Signal Service')).toBeDefined()
    expect(screen.getByText('Signal Accuracy')).toBeDefined()
    expect(screen.getByText('Predict Service')).toBeDefined()
    expect(screen.getByText('Predictions')).toBeDefined()
    expect(screen.getByText('42')).toBeDefined()
    expect(screen.getByText('72.5%')).toBeDefined()
    expect(screen.getByText('1.2.0')).toBeDefined()
    expect(screen.getByText('150')).toBeDefined()
  })

  it('shows Unavailable when APIs fail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Network error')),
    )

    render(
      <MemoryRouter>
        <OverviewPage />
      </MemoryRouter>,
    )

    await waitForLoad()

    const unavailable = screen.getAllByText('Unavailable')
    expect(unavailable.length).toBe(4)
  })

  it('shows warning when prediction count is 0', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/health/deep'))
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: 'ok', predictions_24h: { count_24h: 0 } }),
          })
        if (url.includes('/api/health') && url.includes('18801'))
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPredictHealth) })
        if (url.includes('/api/accuracy/summary'))
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSignalAccuracy) })
        if (url.includes('/api/health'))
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSignalHealth) })
        return Promise.reject(new Error('Unknown URL'))
      }),
    )

    render(
      <MemoryRouter>
        <OverviewPage />
      </MemoryRouter>,
    )

    await waitForLoad()

    expect(screen.getByText('No predictions in the last 24 hours')).toBeDefined()
  })

  it('renders dashboard navigation links', async () => {
    mockFetchAll()

    render(
      <MemoryRouter>
        <OverviewPage />
      </MemoryRouter>,
    )

    await waitForLoad()

    expect(screen.getByText('Signal')).toBeDefined()
    expect(screen.getByText('Predict')).toBeDefined()
    expect(screen.getByText('Trading')).toBeDefined()
    expect(screen.getByText('System')).toBeDefined()
  })
})
