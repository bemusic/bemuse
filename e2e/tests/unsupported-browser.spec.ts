import { expect, test } from '@playwright/test'

test('Can continue despite warning', async ({ page }) => {
  await page.goto('/?flags=unsupported-browser')
  await expect(page.locator('body')).toContainText('Unsupported Browser')
  await page.getByRole('button', { name: 'Continue Anyway' }).click()
  await expect(page.getByTestId('enter-game')).toBeVisible()
})
