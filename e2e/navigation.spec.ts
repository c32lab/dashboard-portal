import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Signal tab is active by default', async ({ page }) => {
    // Default route redirects to /signal
    await expect(page).toHaveURL(/\/signal/)
    // Active tab has text-blue-400 class
    const signalButton = page.getByRole('button', { name: 'Signal' })
    await expect(signalButton).toHaveClass(/text-blue-400/)
  })

  test('click Predict tab → URL changes to /predict', async ({ page }) => {
    await page.getByRole('button', { name: 'Predict' }).click()
    await expect(page).toHaveURL(/\/predict/)
    await expect(page.getByRole('button', { name: 'Predict' })).toHaveClass(/text-blue-400/)
  })

  test('click Trading tab → URL changes to /trading', async ({ page }) => {
    await page.getByRole('button', { name: 'Trading' }).click()
    await expect(page).toHaveURL(/\/trading/)
    await expect(page.getByRole('button', { name: 'Trading' })).toHaveClass(/text-blue-400/)
  })

  test('click System tab → URL changes to /system', async ({ page }) => {
    await page.getByRole('button', { name: 'System' }).click()
    await expect(page).toHaveURL(/\/system/)
    await expect(page.getByRole('button', { name: 'System' })).toHaveClass(/text-blue-400/)
  })

  test('active tab has visual indicator (blue underline)', async ({ page }) => {
    // On /signal, the active tab should have an underline span
    const signalButton = page.getByRole('button', { name: 'Signal' })
    const underline = signalButton.locator('span.bg-blue-500')
    await expect(underline).toBeVisible()

    // Switch to Trading and verify indicator moves
    await page.getByRole('button', { name: 'Trading' }).click()
    const tradingButton = page.getByRole('button', { name: 'Trading' })
    await expect(tradingButton.locator('span.bg-blue-500')).toBeVisible()
    // Signal should no longer have the underline
    await expect(signalButton.locator('span.bg-blue-500')).toBeHidden()
  })
})
