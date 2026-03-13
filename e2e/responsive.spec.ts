import { test, expect } from '@playwright/test'

test.describe('Responsive – Mobile viewport (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('nav adapts at mobile width (horizontal scroll)', async ({ page }) => {
    await page.goto('/')
    // Nav bar should still be visible
    await expect(page.locator('nav')).toBeVisible()
    // The tab container uses overflow-x-auto for horizontal scrolling
    const tabContainer = page.locator('nav .overflow-x-auto')
    await expect(tabContainer).toBeVisible()
    // All tab buttons should still be in the DOM (scrollable)
    await expect(page.getByRole('navigation').getByRole('button', { name:'Signal' })).toBeAttached()
    await expect(page.getByRole('navigation').getByRole('button', { name:'System' })).toBeAttached()
  })

  test('page renders without crashing at 375px', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByText('Amani Trading System')).toBeVisible()
  })
})

test.describe('Responsive – Desktop viewport (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('all tabs are visible without scrolling', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation').getByRole('button', { name:'Signal' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name:'Predict' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name:'Trading' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name:'System' })).toBeVisible()
  })
})
