// Headless runner for the in-browser Mocha test suite (the `?mode=test` path).
//
// It performs a production Vite build (which bundles the `test` mode chunk and
// every `*.spec.*` via `import.meta.glob`), serves the built output with
// `vite preview`, opens `/?mode=test` in a headless Chromium (via the
// `puppeteer` dependency already used by the old Karma setup), waits for the
// suite to finish, and reports the results — exiting non-zero if anything
// failed or no tests ran.
//
// The production build path is used (rather than the dev server) because it is
// the same path exercised by the e2e suite and avoids dev-only dep-optimizer
// quirks. The browser runs the *exact same* `?mode=test` code either way.
import { build, preview } from 'vite'
import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const configFile = path.join(root, 'vite.config.ts')

const TIMEOUT_MS = 3 * 60 * 1000

const MIME = {
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
}

// Serves test fixtures at Karma's historical `/base/<path>` URLs (mapped to
// the bemuse project root, so `/base/src/...` resolves to real source files).
// Returns 404 for anything missing — important because several specs assert a
// download rejects on 404, and because the resource loader relies on 404s to
// fall back to a secondary path.
function fixtureServerPlugin() {
  const handler = (req, res, next) => {
    if (!req.url || !req.url.startsWith('/base/')) return next()
    const rel = decodeURIComponent(req.url.slice('/base/'.length).split('?')[0])
    const filePath = path.join(root, rel)
    if (!filePath.startsWith(root)) {
      res.statusCode = 403
      return res.end('Forbidden')
    }
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.statusCode = 404
        return res.end('Not Found')
      }
      res.setHeader(
        'Content-Type',
        MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
      )
      fs.createReadStream(filePath).pipe(res)
    })
  }
  return {
    name: 'bemuse-test-fixture-server',
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

async function main() {
  console.log('[run-browser-tests] Building app (mode=test)...')
  await build({
    root,
    configFile,
    mode: 'test',
    logLevel: 'warn',
    // Keep readable stack traces / assertion messages for the specs.
    build: { minify: false, sourcemap: true },
  })

  const previewServer = await preview({
    root,
    configFile,
    // 'mpa' disables the SPA history fallback so missing paths return a real
    // 404 (required by the resource/download specs) instead of index.html.
    appType: 'mpa',
    plugins: [fixtureServerPlugin()],
    preview: { port: 0 },
    logLevel: 'warn',
  })
  const url = previewServer.resolvedUrls?.local?.[0]
  if (!url) throw new Error('Could not determine preview server URL.')
  const testUrl = new URL('?mode=test', url).toString()
  console.log(`[run-browser-tests] Serving ${url}`)
  console.log(`[run-browser-tests] Opening ${testUrl}`)

  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-gpu',
    ],
  })

  let exitCode = 1
  try {
    const page = await browser.newPage()
    page.on('console', (msg) => {
      const type = msg.type()
      if (type === 'error') {
        console.log(`[browser:error] ${msg.text()}`)
      }
    })
    page.on('pageerror', (err) => {
      console.log(`[browser:pageerror] ${err.message}`)
    })

    await page.goto(testUrl, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT_MS,
    })

    // Wait for the suite to finish (pass/fail class) OR a boot error dialog.
    await page.waitForFunction(
      () => {
        const cl = document.documentElement.classList
        if (
          cl.contains('mocha-is-passing') ||
          cl.contains('mocha-is-failing')
        ) {
          return true
        }
        if (document.querySelector('.ErrorDialog')) {
          return true
        }
        return false
      },
      { timeout: TIMEOUT_MS, polling: 500 }
    )

    const errorDialog = await page.evaluate(() => {
      const el = document.querySelector('.ErrorDialog')
      return el ? el.textContent : null
    })
    if (errorDialog) {
      console.error('[run-browser-tests] Boot error dialog appeared:')
      console.error(errorDialog)
      throw new Error('The app failed to boot into test mode.')
    }

    const results = await page.evaluate(() => window.MOCHA_RESULTS)
    if (!results) {
      throw new Error('No test results were reported.')
    }

    console.log('')
    console.log('==================== Test Results ====================')
    console.log(`  Total:   ${results.total}`)
    console.log(`  Passed:  ${results.passed}`)
    console.log(`  Failed:  ${results.failed}`)
    console.log(`  Pending: ${results.pending}`)
    console.log('======================================================')

    if (results.failures && results.failures.length) {
      console.log('')
      console.log('Failures:')
      for (const f of results.failures) {
        console.log(`  x ${f.fullName}`)
        for (const e of f.failedExpectations || []) {
          console.log(`      ${e.message}`)
        }
      }
    }

    if (results.total === 0) {
      console.error('[run-browser-tests] No tests ran.')
      exitCode = 1
    } else if (results.failed > 0) {
      exitCode = 1
    } else {
      exitCode = 0
    }
  } finally {
    await browser.close()
    previewServer.httpServer.close()
  }

  process.exit(exitCode)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
