import { Browser, Page } from 'puppeteer'

declare global {
  namespace Prescript {
    interface GlobalState {
      browser: Browser
      page: Page
    }
  }
}

export {}
