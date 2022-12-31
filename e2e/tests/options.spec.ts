import { expect, test } from '@playwright/test'

test('Options can be saved', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('enter-game').click()
  await page.getByTestId('keyboard-mode').click()
  await page.getByTestId('options-button').click()

  const getButton = (index: number) =>
    page.locator(`[data-testid="options-input-key"][data-n="${index + 1}"]`)

  getButton(0).click()

  for (const [index, key] of Array.from('qwertyu').entries()) {
    const button = getButton(index)
    await expect(button).toHaveAttribute('data-editing', 'true')
    await page.keyboard.down(key)
    await expect(button).toHaveAttribute('data-editing', 'false')
    await page.keyboard.up(key)
  }

  await page.reload()
  await page.getByTestId('enter-game').click()
  await page.getByTestId('keyboard-mode').click()
  await page.getByTestId('options-button').click()
  for (const [index, key] of Array.from('QWERTYU').entries()) {
    const button = getButton(index)
    await expect(button).toContainText(key)
  }
})
