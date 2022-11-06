import { test, expect } from '@playwright/test'

test('Project page', async ({ page }, testInfo) => {
  await page.goto('/project/')
  await expect(page.getByText('Play now').first()).toBeVisible()
})

test('Colors page', async ({ page }, testInfo) => {
  await page.goto('/project/docs/colors')
  await expect(page.getByText('Cardinal400').first()).toBeVisible()
})

test('Music page', async ({ page }, testInfo) => {
  await page.goto('/project/music')
  await expect(page.getByText('Artists Showcase').first()).toBeVisible()
  await expect(page.getByText('Everyday evermore').first()).toBeVisible()
})

test('Loading with service worker', async ({ page }, testInfo) => {
  await page.goto('/')
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller?.state))
    .toBe('activated')
  await page.goto('/project/docs/workflows')
  await expect(page.getByText('Publishing npm packages').first()).toBeVisible()
})
