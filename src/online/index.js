
import Bacon      from 'baconjs'
import { Parse }  from 'parse'
import invariant  from 'invariant'

export function Online() {

  const user口 = new Bacon.Bus()
  const user川 = user口.toProperty(Parse.User.current()).map(unwrapUser)

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

  function logIn({ username, password }) {
    invariant(typeof username === 'string', 'username must be a string')
    invariant(typeof password === 'string', 'password must be a string')
    return (
      wrapPromise(Parse.User.logIn(username, password))
      .tap(user => user口.push(user))
    )
  }

  function logOut() {
    return (
      Promise.resolve(Parse.User.logOut()).then(() => {})
      .tap(() => user口.push(null))
    )
  }

  return {
    user川,
    signUp,
    logIn,
    logOut,
  }
}

export default Online
