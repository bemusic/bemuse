
import Bacon      from 'baconjs'
import { Parse }  from 'parse'
import invariant  from 'invariant'

// https://github.com/baconjs/bacon.js/issues/536
function makeEager(川) {
  return 川.subscribe(() => {})
}

export function Online() {

  const user口 = new Bacon.Bus()
  const user川 = user口.toProperty(Parse.User.current()).map(unwrapUser)

  // user川 needs to be eager, so that when someone subscribes, they always
  // get the latest user value.
  makeEager(user川)

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

  function Reloadable(promiseFactory) {
    let execute口 = new Bacon.Bus()
    let state川 = (
      Bacon.once().merge(execute口)
      .flatMapLatest(() => {
        return (
          Bacon.fromPromise(Promise.resolve(promiseFactory()))
          .map(    value  => prev => _.assign({ }, prev, { status: 'completed', value, error: null }))
          .mapError(error => prev => _.assign({ }, prev, { status: 'error', error }))
          .startWith(        prev => _.assign({ }, prev, { status: 'loading', error: null }))
        )
      })
      .scan(
        { status: 'loading', value: null, error: null },
        (prev, next) => next(prev)
      )
    )
    makeEager(state川)
    return {
      state川,
      execute() {
        execute口.push()
      },
    }
  }

  function getScoreboard({ md5, playMode }) {
    invariant(typeof md5      === 'string', 'md5 must be a string')
    invariant(typeof playMode === 'string', 'playMode must be a string')
    var query = new Parse.Query('GameScore')
    query.equalTo('md5', md5)
    query.equalTo('playMode', playMode)
    query.descending('score')
    query.limit(100)
    return (
      wrapPromise(query.find())
      .then(results => {
        return results.map(toObject)
      })
    )
  }

  function submitOrRetrieveRecord(data) {
    return Promise.resolve(user川.first().toPromise()).then(function(user) {
      if (user) {
        return submitScore(data)
      } else {
        let error = new Error('Unauthenticated!')
        error.isUnauthenticated = true
        throw error
      }
    })
  }

  function Ranking(data) {

    const submission物 = new Reloadable(() => submitOrRetrieveRecord(data))
    const scoreboard物 = new Reloadable(() => getScoreboard(data))

    submission物.execute()

    submission物.state川
    .filter(state => state.status === 'error' || state.status === 'completed')
    .onValue(() => scoreboard物.execute())

    const state川 = Bacon.combineWith(
      function(submission, scoreboard) {
        return {
          data: scoreboard.value,
          meta: {
            scoreboard: {
              status: scoreboard.status,
              error:  scoreboard.error
            },
            submission: submission,
          },
        }
      },
      submission物.state川.map(state => {
        if (state.status === 'completed') {
          return {
            status: 'completed',
            error:  null,
            record: state.value.data,
            rank:   state.meta.rank,
          }
        } else if (state.status === 'error' && state.error.isUnauthenticated) {
          return {
            status: 'unauthenticated',
            error:  null,
            record: null,
            rank:   null,
          }
        } else {
          return {
            status: state.status,
            error:  state.error,
            record: null,
            rank:   null,
          }
        }
      }),
      scoreboard物.state川
    )

    return {
      state川,
      resubmit() {
        resubmit口.push()
      },
      reloadScoreboard() {
        reload口.push()
      },
    }
  }

  return {
    user川,
    signUp,
    logIn,
    logOut,
    submitScore,
    scoreboard: getScoreboard,
    Ranking,
  }
}

export default Online
