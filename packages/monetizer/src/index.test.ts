/// <reference types="jest" />

import { Monetizer } from '.'

it('creates a meta tag and returns a dispose function', () => {
  const monetizer = new Monetizer()
  try {
    const dispose = monetizer.monetize('$dt.in.th')
    expect(getMonetizingPointer()).toBe('$dt.in.th')
    dispose()
    expect(getMonetizingPointer()).toBe('')
  } finally {
    monetizer.dispose()
  }
})

// https://webmonetization.org/docs/probabilistic-rev-sharing
it('do a probabilistic revenue sharing', () => {
  const monetizer = new Monetizer()
  try {
    monetizer.monetize('$dt.in.th')
    monetizer.monetize('$twitter.xrptipbot.com/bemusegame')

    setRngOutput(monetizer, 0.49)
    expect(getMonetizingPointer()).toBe('$dt.in.th')

    setRngOutput(monetizer, 0.51)
    expect(getMonetizingPointer()).toBe('$twitter.xrptipbot.com/bemusegame')

    monetizer.monetize({
      content: '$twitter.xrptipbot.com/dtinth',
      weight: 3,
    })
    setRngOutput(monetizer, 0.21)
    expect(getMonetizingPointer()).toBe('$twitter.xrptipbot.com/bemusegame')

    setRngOutput(monetizer, 0.41)
    expect(getMonetizingPointer()).toBe('$twitter.xrptipbot.com/dtinth')
  } finally {
    monetizer.dispose()
  }
})

it('supports prioritization', () => {
  const monetizer = new Monetizer()
  try {
    monetizer.monetize('$dt.in.th')
    monetizer.monetize({
      content: '$twitter.xrptipbot.com/bemusegame',
      priority: 2,
    })

    setRngOutput(monetizer, 0.49)
    expect(getMonetizingPointer()).toBe('$twitter.xrptipbot.com/bemusegame')

    setRngOutput(monetizer, 0.51)
    expect(getMonetizingPointer()).toBe('$twitter.xrptipbot.com/bemusegame')
  } finally {
    monetizer.dispose()
  }
})

function setRngOutput(monetizer: Monetizer, rng: number) {
  monetizer._runtime = { Math: { random: () => rng } }
  monetizer.update()
}

function getMonetizingPointer() {
  const meta = document.querySelector(
    'meta[name="monetization"]'
  ) as HTMLMetaElement | null
  return (meta && meta.content) || ''
}
