
import Bacon  from 'baconjs'

// Wraps a Parse promise with a Bluebird promise,
// and throws a proper Error object, instead of a custom one.
export function wrapPromise(promise) {
  return Promise.resolve(promise).catch(function(error) {
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Parse Error ' + error.code + ': ' + error.message)
    }
  })
}

// Converts a Parse.User to a plain Object, representing the user.
export function unwrapUser(parseUser) {
  if (!parseUser) return null
  return {
    username: parseUser.get('username'),
    email:    parseUser.get('email'),
  }
}

// Converts a Parse.Object to a plain Object.
export function toObject(物) {
  return Object.assign({ }, 物.attributes, { id: 物.id })
}

// Returns a promise representing the outcome of a given promise.
export function outcomeOfPromise(promise) {
  return Promise.resolve(promise).then(
    value => ({ status: 'completed', value, error: null }),
    error => ({ status: 'error', error })
  )
}

// Maps a stream with an outcome of executing a promise generator.
export function withOutcome(promiseFactory) {

  const INITIAL_STATE = { status: 'loading', value: null, error: null }

  return execute川 => (execute川
    .flatMapLatest(execute)
    .scan(INITIAL_STATE, (state, update) => Object.assign({ }, state, update))
  )

  function execute(payload) {
    return (Bacon.fromPromise(outcomeOfPromise(promiseFactory(payload)))
      .startWith({ status: 'loading', error: null })
    )
  }
}
