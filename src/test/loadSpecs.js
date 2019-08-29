export function loadSpecs() {
  const context = require.context('..', true, /\.spec\.[jt]sx?$/)
  for (const key of context.keys()) {
    describe(key, () => {
      context(key)
    })
  }
}

export default loadSpecs
