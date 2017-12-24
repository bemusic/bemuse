export function loadSpecs () {
  const context = require.context('..', true, /\.spec\.js$/)
  for (const key of context.keys()) {
    describe(key, () => {
      context(key)
    })
  }
}

export default loadSpecs
