
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
    id:       parseUser.id,
  }
}

// Converts a Parse.Object to a plain Object.
export function toObject(物) {
  return Object.assign({ }, 物.attributes, { id: 物.id })
}
