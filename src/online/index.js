
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

  function toObject(物) {
    return Object.assign({ }, 物.attributes, { id: 物.id })
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
      wrapPromise(Parse.User.logOut()).then(() => {})
      .tap(() => user口.push(null))
    )
  }

  function submitScore(info) {
    return (
      wrapPromise(Parse.Cloud.run('submitScore', info))
      .then(({ data, meta }) => {
        return {
          data: toObject(data),
          meta: meta
        }
      })
    )
  }

  function scoreboard({ md5, playMode }) {
    var query = new Parse.Query('GameScore')
    query.equalTo('md5', md5)
    query.equalTo('playMode', playMode)
    query.descending('score')
    query.limit(100)
    return (
      wrapPromise(query.find())
      .then(results => {
        return {
          data: results.map(toObject)
        }
      })
    )
  }

  return {
    user川,
    signUp,
    logIn,
    logOut,
    submitScore,
    scoreboard,
  }
}

export default Online
