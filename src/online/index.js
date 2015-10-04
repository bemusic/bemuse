
import Bacon      from 'baconjs'
import invariant  from 'invariant'
import Cache      from 'lru-cache'

import OnlineService    from './online-service'
import { withOutcome }  from './utils'

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

  const service = new OnlineService()

  const cache = new Cache()

  const user口 = new Bacon.Bus()
  const user川 = (
    user口
    // https://github.com/baconjs/bacon.js/issues/536
    .toProperty(null)
    .map(user => user || service.getCurrentUser())
  )

  // Make sure to clear cache every time user logs in.
  user川.onValue(() => {
    cache.reset()
  })

  function signUp(options) {
    return service.signUp(options).tap(user => user口.push(user))
  }

  function logIn(options) {
    return service.logIn(options).tap(user => user口.push(user))
  }

  function logOut() {
    return service.logOut().tap(() => user口.push(null))
  }

  function submitScore(info) {
    return service.submitScore(info)
  }

  function retrieveRecord(descriptor) {
    let cacheKey  = descriptor.recordCacheKey()
    let cached    = cache.get(cacheKey)
    if (cached) {
      return Promise.resolve(cached)
    }
    return (
      service.retrieveRecord(descriptor)
      .tap(result => {
        cache.set(cacheKey, result)
      })
    )
  }

  function getScoreboard(descriptor) {
    let cacheKey  = descriptor.scoreboardCacheKey()
    let cached    = cache.get(cacheKey)
    if (cached) {
      return Promise.resolve(cached)
    }
    return (
      service.retrieveScoreboard(descriptor)
      .tap(result => {
        cache.set(cacheKey, result)
      })
    )
  }

  function submitOrRetrieveRecord(data) {
    if (service.isLoggedIn()) {
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
      withOutcome(() => submitOrRetrieveRecord(data))(
        Bacon.once()
        .merge(resubmit口)
        .merge(user川.changes().filter(user => !!user).first())
      )
      .map(state => {
        if (state.status === 'completed') {
          return {
            status: 'completed',
            error:  null,
            record: state.value,
          }
        } else if (state.status === 'error' && state.error.isUnauthenticated) {
          return {
            status: 'unauthenticated',
            error:  null,
            record: null,
          }
        } else {
          return {
            status: state.status,
            error:  state.error,
            record: null,
          }
        }
      })
    )

    const scoreboard川 = withOutcome(() => getScoreboard(descriptor))(
      submission川.filter(({ status }) =>
        status === 'unauthenticated' || status === 'completed'
      )
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
