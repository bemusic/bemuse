import { expect, test } from '@playwright/test'

test('Can sign up', async ({ page }) => {
  await page.goto('/?flags=fake-scoreboard,skip-to-music-select')
  await page.getByText('Log In / Create an Account').click()
  await page
    .locator('.AuthenticationPanel')
    .getByText('Create an Account')
    .click()

  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Email').fill('tester@tester.bemuse.ninja')
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByLabel('Confirm Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Sign Me Up' }).click()

  await expect(page.locator('body')).toContainText('Log Out (tester)')
})

test('Cannot sign up if duplicate account', async ({ page }) => {
  await page.goto('/?flags=fake-scoreboard,skip-to-music-select')
  await page.getByText('Log In / Create an Account').click()
  await page
    .locator('.AuthenticationPanel')
    .getByText('Create an Account')
    .click()

  await page.getByLabel('Username').fill('taken')
  await page.getByLabel('Email').fill('taken@tester.bemuse.ninja')
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByLabel('Confirm Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Sign Me Up' }).click()

  await expect(page.locator('.AuthenticationPanel')).toContainText(
    'Username already taken'
  )
})

test('Can log in and out', async ({ page }) => {
  await page.goto('/?flags=fake-scoreboard,skip-to-music-select')
  await page.getByText('Log In / Create an Account').click()
  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Log In' }).click()
  page.on('dialog', (dialog) => dialog.accept())
  await page.getByText('Log Out (tester)').click()
  await expect(page.getByText('Log In / Create an Account')).toBeVisible()
})

test('Can submit score to improve', async ({ page }) => {
  await page.goto('/?mode=playground&playground=result&flags=fake-scoreboard')
  await expect(page.locator('.Ranking')).toContainText('111111')
  await page.getByText('log in or create an account').click()
  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Log In' }).click()
  await expect(page.locator('.Ranking')).not.toContainText('111111')
  await expect(page.locator('.Ranking')).toContainText('222222')
})
