import { test, expect, Page, TestInfo } from '@playwright/test'

test('Gameplay smoke test', async ({ page }, testInfo) => {
  await startBemuse(page)

  await test.step('Enter game', async () => {
    await takeScreenshot(page, testInfo, 'Title')
    await page.getByTestId('enter-game').click()
    await takeScreenshot(page, testInfo, 'Mode selection')
    await page.getByTestId('keyboard-mode').click()
    await takeScreenshot(page, testInfo, 'Song selection')
    await page.getByTestId('play-selected-chart').click()
    await expect(page.locator('.game-display canvas')).toBeVisible()
  })

  await test.step('Play through the game', async () => {
    await test.step('Press Enter to start the song', async () => {
      await page.waitForTimeout(100)
      await page.keyboard.down('Enter')
      await page.waitForTimeout(100)
      await page.keyboard.up('Enter')
    })

    const gameEvents = [
      { key: 'j', beat: 4, expectedScore: 69444 },
      { key: 'f', beat: 5, expectedScore: 138888 },
      { key: 'f', beat: 6, expectedScore: 208333 },
      { key: 'k', beat: 7, expectedScore: 277777 },
      { key: 'j', beat: 8, expectedScore: 347221 },
      { key: 'f', beat: 8.5, expectedScore: 416666 },
      { key: 'f', beat: 9, expectedScore: 486110 },
      { key: 'k', beat: 9.75, expectedScore: 524305 },
    ]
    for (const [i, { key, beat, expectedScore }] of gameEvents.entries()) {
      const t = (beat * 60) / 140
      const tString = t.toFixed(2)
      const n = i + 1
      const title = `Hit key ${key} at t=${tString} (note #${n}, expectedScore=${expectedScore})`
      await test.step(title, async () => {
        await page.evaluate(
          async ([t]) => {
            const anyWindow = window as any
            const BemuseTestMode = anyWindow.BemuseTestMode
            anyWindow.TEST_pausePromise = BemuseTestMode.pauseAt(t)
          },
          [t]
        )
        await page.evaluate(() => (window as any).TEST_pausePromise)
        await page.keyboard.down(key)
        await page.waitForTimeout(100)
        await page.keyboard.up(key)
        await expect
          .poll(async () =>
            page.evaluate(() => {
              const anyWindow = window as any
              const BemuseTestMode = anyWindow.BemuseTestMode
              return BemuseTestMode.getScore()
            })
          )
          .toBe(expectedScore)
      })
    }
  })

  await takeScreenshot(page, testInfo, 'Gameplay')
  await page.evaluate(() => {
    const anyWindow = window as any
    const BemuseTestMode = anyWindow.BemuseTestMode
    BemuseTestMode.unpause()
  })
  await expect(page.locator('.ResultScene')).toBeVisible()
  await expect(page.locator('.Rankingのyours')).toHaveText(/create an account/)
  await expect(page.locator('.Rankingのleaderboard')).toHaveText(/No Data/)

  await page.locator('.Rankingのyours').getByText('log in').click()
  await page
    .locator('.AuthenticationPanel')
    .getByRole('textbox', { name: 'Username' })
    .fill('Playwright')
  await page
    .locator('.AuthenticationPanel')
    .getByRole('textbox', { name: 'Password' })
    .fill('hunter2')
  await takeScreenshot(page, testInfo, 'Authentication')
  await page
    .locator('.AuthenticationPanel')
    .getByRole('button', { name: 'Log In' })
    .click()

  await expect(page.locator('.Rankingのyours')).toHaveText(/Playwright/)
  await expect(page.locator('.Rankingのleaderboard')).toHaveText(/Playwright/)

  await takeScreenshot(page, testInfo, 'Result')
})

async function takeScreenshot(page: Page, testInfo: TestInfo, name: string) {
  await testInfo.attach(name, {
    body: await page.screenshot(),
    contentType: 'image/png',
  })
}

async function startBemuse(page: Page) {
  const testMusicServer =
    'https://raw.githubusercontent.com/bemusic/bemuse-test-server/master'
  const url = `/?server=${testMusicServer}&flags=fake-scoreboard`
  await page.goto(url)

  // Enter the test mode
  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const BemuseTestMode = (window as any).BemuseTestMode
          if (BemuseTestMode) {
            BemuseTestMode.enableTestMode()
            return true
          } else {
            return false
          }
        }),
      { timeout: 10000 }
    )
    .toBe(true)
}
