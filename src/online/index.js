
import Bacon      from 'baconjs'
import { Parse }  from 'parse'
import invariant  from 'invariant'

export function Online() {

  const user口 = new Bacon.Bus()
  const user川 = user口.toProperty(null).map(unwrapUser)

  function wrapPromise(promise) {
    return Promise.resolve(promise).catch(function(error) {
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Parse Error ' + error.code + ': ' + error.message)
      }
    })
  }

  function unwrapUser(parseUser) {
    if (!parseUser) return null
    return {
      username: parseUser.get('username'),
      email:    parseUser.get('email'),
    }
  }

  function signUp({ username, password, email }) {
    invariant(typeof username === 'string', 'username must be a string')
    invariant(typeof password === 'string', 'password must be a string')
    invariant(typeof email === 'string',    'email must be a string')
    return (
      wrapPromise(Parse.User.signUp(username, password, { email }))
      .tap(user => user口.push(user))
    )
  }

  return {
    user川,
    signUp
  }
}

export default Online
