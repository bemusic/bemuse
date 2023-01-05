export const SUPPORTED = [
  {
    name: 'Firefox 92+',
    test: () => checkUserAgent(/Firefox\/(\d+)/, 92),
  },
  {
    name: 'Chrome 93+',
    test: () => checkUserAgent(/Chrome\/(\d+)\./, 93),
  },
  {
    name: 'Safari 15.4+',
    test: () => checkUserAgent(/Version\/(\d+)\.\S+ Safari\//, 15),
  },
  {
    name: 'iOS 15.4+ (iPad Pro)',
    test: () => checkUserAgent(/iPad; CPU OS (\d+)/, 15),
  },
]

function checkUserAgent(pattern, num) {
  const match = navigator.userAgent.match(pattern)
  if (!match) return false
  if (+match[1] >= num) return true
  return false
}

export function isBrowserSupported() {
  for (const browser of SUPPORTED) if (browser.test()) return true
  return false
}
