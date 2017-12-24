export const SUPPORTED = [
  {
    name: 'Firefox 37+',
    test: () => checkUserAgent(/Firefox\/(\d+)/, 37)
  },
  {
    name: 'Chrome 54+',
    test: () => checkUserAgent(/Chrome\/(\d+)\./, 54)
  },
  {
    name: 'Safari 8+',
    test: () => checkUserAgent(/Version\/(\d+)\.\S+ Safari\//, 8)
  },
  {
    name: 'iOS 9.2+ (iPad Pro)',
    test: () => checkUserAgent(/iPad; CPU OS (\d+)/, 9)
  }
]

function checkUserAgent (pattern, num) {
  let match = navigator.userAgent.match(pattern)
  if (!match) return false
  if (+match[1] >= num) return true
  return false
}

export function isBrowserSupported () {
  for (let browser of SUPPORTED) if (browser.test()) return true
  return false
}
