const { action, defer, to } = require('prescript')
const puppeteer = require('puppeteer')
const expect = require('expect')

action('Open browser', async (state) => {
  const puppeteerOptions = { headless: true }
  if (process.env.CIRCLECI) {
    puppeteerOptions.args = [ '--no-sandbox', '--disable-setuid-sandbox' ]
  }
  state.browser = await puppeteer.launch(puppeteerOptions)
  state.page = await state.browser.newPage()
  await state.page.setViewport({ width: 1200, height: 480 })
  const testMusicServer =
    'https://raw.githubusercontent.com/bemusic/bemuse-test-server/master'
  const bemusePort = process.env.BEMUSE_PORT || '8080'
  const url = `http://localhost:${bemusePort}/?server=${testMusicServer}`
  await state.page.goto(url)
})

defer('Close browser', async (state) => {
  await state.browser.close()
})

action('Turn on test mode', async (state) => {
  await state.page.waitForFunction(
    () => {
      if (window.BemuseTestMode) {
        window.BemuseTestMode.enableTestMode()
        return true
      } else {
        return false
      }
    },
    { timeout: 10000 }
  )
})

action('Enter game', async (state) => {
  await state.page.waitForSelector('[data-testid="enter-game"]')
  await state.page.click('[data-testid="enter-game"]')
  await state.page.waitForSelector('[data-testid="keyboard-mode"]')
})

action('Select keyboard mode', async (state) => {
  await state.page.waitForSelector('[data-testid="keyboard-mode"]')
  await state.page.click('[data-testid="keyboard-mode"]')
  await state.page.waitForSelector('[data-testid="play-selected-chart"]')
})

action('Select the song and start the game', async (state) => {
  await state.page.waitForSelector('[data-testid="play-selected-chart"]')
  await state.page.click('[data-testid="play-selected-chart"]')
  await state.page.waitForSelector('.game-display canvas', { visible: true })
})

to('Play through the game', () => {
  action('Press Enter to start the song', async (state) => {
    await state.page.waitFor(100)
    await state.page.keyboard.down('Enter')
    await state.page.waitFor(100)
    await state.page.keyboard.up('Enter')
  })
  const keys = [
    { key: 'j', beat: 4, expectedScore: 69444 },
    { key: 'f', beat: 5, expectedScore: 138888 },
    { key: 'f', beat: 6, expectedScore: 208333 },
    { key: 'k', beat: 7, expectedScore: 277777 },
    { key: 'j', beat: 8, expectedScore: 347221 },
    { key: 'f', beat: 8.5, expectedScore: 416666 },
    { key: 'f', beat: 9, expectedScore: 486110 },
    { key: 'k', beat: 9.75, expectedScore: 524305 },
  ]
  for (const [i, event] of keys.entries()) {
    const t = (event.beat * 60) / 140
    action`Hit key ${event.key} at t=${t.toFixed(2)} (note #${
      i + 1
    }) (score should be ${event.expectedScore})`(async (state, context) => {
      await state.page.evaluate((t) => {
        window.TEST_pausePromise = window.BemuseTestMode.pauseAt(t)
      }, t)
      await state.page.evaluate(() => window.TEST_pausePromise)
      await state.page.keyboard.down(event.key)
      await state.page.waitFor(100)
      await state.page.keyboard.up(event.key)
      const score = await state.page.evaluate(() =>
        window.BemuseTestMode.getScore()
      )
      expect(score).toEqual(event.expectedScore)
    })
  }

  action(
    'Let the game finish and wait for result screen to show',
    async (state) => {
      await takeScreenshot(state.page, 'gameplay')
      await state.page.evaluate(() => {
        window.BemuseTestMode.unpause()
      })
      await state.page.waitForSelector('.ResultScene')
      await takeScreenshot(state.page, 'result')
    }
  )
})

async function takeScreenshot(page, name) {
  if (!process.env.SCREENSHOT_DIR) return
  await page.screenshot({
    path: `${process.env.SCREENSHOT_DIR}/${name}.png`,
  })
}
