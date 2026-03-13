import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Overview tab is active by default', async ({ page }) => {
    // Default route redirects to /overview
    await expect(page).toHaveURL(/\/overview/)
    // Active tab has text-blue-400 class
    const overviewButton = page.getByRole('navigation').getByRole('button', { name: 'Overview' })
    await expect(overviewButton).toHaveClass(/text-blue-400/)
  })

  test('click Predict tab → URL changes to /predict', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name:'Predict' }).click()
    await expect(page).toHaveURL(/\/predict/)
    await expect(page.getByRole('navigation').getByRole('button', { name:'Predict' })).toHaveClass(/text-blue-400/)
  })

  test('click Trading tab → URL changes to /trading', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name:'Trading' }).click()
    await expect(page).toHaveURL(/\/trading/)
    await expect(page.getByRole('navigation').getByRole('button', { name:'Trading' })).toHaveClass(/text-blue-400/)
  })

  test('click System tab → URL changes to /system', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name:'System' }).click()
    await expect(page).toHaveURL(/\/system/)
    await expect(page.getByRole('navigation').getByRole('button', { name:'System' })).toHaveClass(/text-blue-400/)
  })

  test('active tab has visual indicator (blue underline)', async ({ page }) => {
    // On /overview (default), the Overview button should have an underline span
    const overviewButton = page.getByRole('navigation').getByRole('button', { name: 'Overview' })
    await expect(overviewButton.locator(':scope > span.bg-blue-500')).toBeVisible()

    // Switch to Signal and verify indicator moves
    const signalButton = page.getByRole('navigation').getByRole('button', { name: 'Signal' })
    await signalButton.click()
    await expect(signalButton.locator(':scope > span.bg-blue-500')).toBeVisible()
    // Overview should no longer have the underline
    await expect(overviewButton.locator(':scope > span.bg-blue-500')).toBeHidden()
  })
})
