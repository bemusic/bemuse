import { expect, test } from '@playwright/test'

test('Can search for a song', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('enter-game').click()
  await page.getByTestId('keyboard-mode').click()
  await expect(page.getByTestId('music-list-item').first()).toBeVisible()
  expect(await page.getByTestId('music-list-item').count()).toBeGreaterThan(3)
  await page.getByPlaceholder('Filter…').fill('only one')
  await expect(page.getByTestId('music-list-item')).toHaveCount(1)
})
