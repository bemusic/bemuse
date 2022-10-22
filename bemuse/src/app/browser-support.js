export const SUPPORTED = [
  {
    name: 'Firefox 69+',
    test: () => checkUserAgent(/Firefox\/(\d+)/, 69),
  },
  {
    name: 'Chrome 76+',
    test: () => checkUserAgent(/Chrome\/(\d+)\./, 76),
  },
  {
    name: 'Safari 14+',
    test: () => checkUserAgent(/Version\/(\d+)\.\S+ Safari\//, 14),
  },
  {
    name: 'iOS 14+ (iPad Pro)',
    test: () => checkUserAgent(/iPad; CPU OS (\d+)/, 14),
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
