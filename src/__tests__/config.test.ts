import { describe, it, expect } from 'vitest'
import { TAB_CONFIG, DASHBOARD_URLS } from '../config'

describe('config', () => {
  it('exports DASHBOARD_URLS with default values', () => {
    expect(DASHBOARD_URLS.signal).toBe('http://localhost:3080')
    expect(DASHBOARD_URLS.predict).toBe('http://localhost:18828')
    expect(DASHBOARD_URLS.trading).toBe('http://localhost:3080/trading')
    expect(DASHBOARD_URLS.system).toBe('http://localhost:3080/advanced/system')
  })

  it('exports TAB_CONFIG with four tabs', () => {
    expect(TAB_CONFIG).toHaveLength(4)
    const labels = TAB_CONFIG.map((t) => t.label)
    expect(labels).toEqual(['Signal', 'Predict', 'Trading', 'System'])
  })

  it('each tab has required fields', () => {
    for (const tab of TAB_CONFIG) {
      expect(tab.label).toBeTruthy()
      expect(tab.path).toMatch(/^\//)
      expect(tab.src).toMatch(/^https?:\/\//)
      expect(tab.healthUrl).toMatch(/^https?:\/\//)
    }
  })

  it('tab src matches DASHBOARD_URLS', () => {
    expect(TAB_CONFIG[0].src).toBe(DASHBOARD_URLS.signal)
    expect(TAB_CONFIG[1].src).toBe(DASHBOARD_URLS.predict)
    expect(TAB_CONFIG[2].src).toBe(DASHBOARD_URLS.trading)
    expect(TAB_CONFIG[3].src).toBe(DASHBOARD_URLS.system)
  })
})
