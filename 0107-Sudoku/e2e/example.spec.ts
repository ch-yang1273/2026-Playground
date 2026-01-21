import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Vite \+ Vue/)
})

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Vite + Vue')
})
