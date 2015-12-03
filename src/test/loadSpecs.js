
export function loadSpecs () {
  let context = require.context('../../spec', true, /_spec\.js$/)
  for (let key of context.keys()) {
    context(key)
  }
}

export default loadSpecs
