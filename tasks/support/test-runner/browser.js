
import launcher   from 'browser-launcher'

export function start () {
  return Promise.promisify(launcher)().then(function (launchBrowser) {
    return {
      launch (url) {
        let options = {
          browser: process.env.BROWSER || 'chrome',
          headless: process.env.HEADLESS === 'true',
        }
        return Promise.promisify(launchBrowser)(url, options)
      }
    }
  })
}

