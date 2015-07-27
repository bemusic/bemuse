
import Bacon      from 'baconjs'
import { Parse }  from 'parse'
import invariant  from 'invariant'
import Cache      from 'lru-cache'

// https://github.com/baconjs/bacon.js/issues/536
function makeEager(川) {
  return 川.subscribe(() => {})
}

class Descriptor {
  constructor({ md5, playMode }) {
    invariant(typeof md5      === 'string', 'md5 must be a string')
    invariant(typeof playMode === 'string', 'playMode must be a string')
    this.md5      = md5
    this.playMode = playMode
  }
  recordCacheKey() {
    return `record/${this.md5}/${this.playMode}`
  }
  scoreboardCacheKey() {
    return `scoreboard/${this.md5}/${this.playMode}`
  }
}

export function Online() {

  const cache = new Cache()
  const user口 = new Bacon.Bus()
  const user川 = user口.toProperty(Parse.User.current()).map(unwrapUser)

  // user川 needs to be eager, so that when someone subscribes, they always
  // get the latest user value.
  makeEager(user川)

  // Make sure to clear cache every time user logs in.
  user川.onValue(() => {
    cache.reset()
  })

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

  function parseRetrieveRecord(descriptor) {
    let { md5, playMode } = descriptor
    let query = new Parse.Query('GameScore')
    query.equalTo('md5',      md5)
    query.equalTo('playMode', playMode)
    query.equalTo('user',     Parse.User.current())
    return wrapPromise(query.first()).tap(record => {
      cache.set(descriptor.recordCacheKey(), record)
    })
  }

  function parseRetrieveRank(descriptor, gameScore) {
    let { md5, playMode } = descriptor
    let countQuery = new Parse.Query('GameScore')
    countQuery.equalTo('md5',       md5)
    countQuery.equalTo('playMode',  playMode)
    countQuery.greaterThan('score', gameScore.get('score'))
    return wrapPromise(countQuery.count())
  }

  function retrieveRecord(descriptor) {
    let cacheKey  = descriptor.recordCacheKey()
    let cached    = cache.get(cacheKey)
    if (cached) {
      return Promise.resolve(cached)
    }
    return (
      parseRetrieveRecord(descriptor)
      .then(gameScore => {
        if (gameScore) {
          return (
            parseRetrieveRank(descriptor, gameScore)
            .then(x => x + 1, () => null)
            .then(rank => ({ data: toObject(gameScore), meta: { rank } }))
          )
        } else {
          return {
            data: null,
            meta: { rank: null }
          }
        }
      })
      .tap(result => {
        cache.set(cacheKey, result)
      })
    )
  }

  function reloadable川(promiseFactory, execute川) {
    let state川 = (
      execute川
      .flatMapLatest(() => {
        return (
          Bacon.fromPromise(Promise.resolve(promiseFactory()))
          .map(    value  => prev => Object.assign({ }, prev, { status: 'completed', value, error: null }))
          .mapError(error => prev => Object.assign({ }, prev, { status: 'error', error }))
          .startWith(        prev => Object.assign({ }, prev, { status: 'loading', error: null }))
        )
      })
      .scan(
        { status: 'loading', value: null, error: null },
        (prev, next) => next(prev)
      )
    )
    return state川
  }

  function getScoreboard(descriptor) {
    let cacheKey  = descriptor.scoreboardCacheKey()
    let cached    = cache.get(cacheKey)
    if (cached) {
      return Promise.resolve(cached)
    }
    let { md5, playMode } = descriptor
    var query = new Parse.Query('GameScore')
    query.equalTo('md5',      md5)
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
      .tap(result => {
        cache.set(cacheKey, result)
      })
    )
  }

  function submitOrRetrieveRecord(data) {
    if (Parse.User.current()) {
      if (data.score) {
        cache.reset()
        return submitScore(data)
      } else {
        return retrieveRecord(new Descriptor(data))
      }
    } else {
      let error = new Error('Unauthenticated!')
      error.isUnauthenticated = true
      return Promise.reject(error)
    }
  }

  function Ranking(data) {

    const descriptor   = new Descriptor(data)
    const resubmit口   = new Bacon.Bus()
    const reload口     = new Bacon.Bus()

    const submission川 = (
      reloadable川(
        () => submitOrRetrieveRecord(data),
        (
          Bacon.once()
          .merge(resubmit口)
          .merge(user川.changes().filter(user => !!user).first())
        )
      )
      .map(state => {
        if (state.status === 'completed') {
          return {
            status: 'completed',
            error:  null,
            record: state.value.data,
            rank:   state.value.meta.rank,
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
      })
    )

    const scoreboard川 = reloadable川(
      () => getScoreboard(descriptor),
      submission川.filter(({ status }) => status === 'unauthenticated' || status === 'completed')
    )

    const state川 = Bacon.combineWith(
      function(submission, scoreboard) {
        return {
          data: scoreboard.value && scoreboard.value.data,
          meta: {
            scoreboard: {
              status: scoreboard.status,
              error:  scoreboard.error
            },
            submission: submission,
          },
        }
      },
      submission川,
      scoreboard川
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
    scoreboard(options) {
      return getScoreboard(new Descriptor(options))
    },
    Ranking,
  }
}

export default Online
