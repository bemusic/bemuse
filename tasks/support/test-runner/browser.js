
import promisify  from 'es6-promisify'
import launcher   from 'browser-launcher'

export function start() {
  return promisify(launcher)().then(function(launchBrowser) {
    return {
      launch(url) {
        let options = {
          browser: process.env.BROWSER || 'chrome',
          headless: process.env.HEADLESS === 'true',
        }
        return promisify(launchBrowser)(url, options)
      }
    }
  })
}

