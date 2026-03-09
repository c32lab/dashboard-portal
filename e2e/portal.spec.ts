import { test, expect } from '@playwright/test'

test.describe('Dashboard Portal (Home Page)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders without crashing', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
    const body = page.locator('body')
    await expect(body).not.toBeEmpty()
  })

  test('shows "Amani Trading System" title', async ({ page }) => {
    await expect(page.getByText('Amani Trading System')).toBeVisible()
  })

  test('no uncaught errors on page load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await page.waitForTimeout(2000)

    const unexpectedErrors = errors.filter(
      (e) => !e.includes('fetch') && !e.includes('network') && !e.includes('Failed to fetch')
    )
    expect(unexpectedErrors).toHaveLength(0)
  })
})
