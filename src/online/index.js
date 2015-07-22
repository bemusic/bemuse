
import Bacon      from 'baconjs'
import { Parse }  from 'parse'
import invariant  from 'invariant'

export function Online() {

  const user口 = new Bacon.Bus()
  const user川 = user口.toProperty(Parse.User.current()).map(unwrapUser)

  // We need to keep at least one subscriber to user川 to prevent the value
  // from reverting to the initial vale when Online is constructed.
  user川.subscribe(() => {})

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
        return {
          data: results.map(toObject)
        }
      })
    )
  }

  function Ranking(data) {

    const resubmit口     = new Bacon.Bus()
    const reload口       = new Bacon.Bus()
    const shouldSubmit川 = user川.map(user => !!user).skipDuplicates()

    const submit川       = (
      shouldSubmit川.flatMap(yes => yes ? Bacon.once() : Bacon.never()).merge(resubmit口)
    )
    const notSubmit川    = (
      shouldSubmit川.flatMap(yes => yes ? Bacon.never() : Bacon.once())
    )

    const submitted川        = submit川.flatMapLatest(() => (
      Bacon.fromPromise(submitScore(data))
    ))
    const submissionResult川 = (
      submitted川.skipErrors().toProperty(null)
    )
    const submissionData川   = submissionResult川.map(
      result => result && result.data
    )
    const submissionRank川   = submissionResult川.map(
      result => result && result.meta && result.meta.rank
    )
    const submissionError川  = (
      submitted川.errors().mapError(error => error).toProperty(null)
    )
    const submissionStatus川 = (
      notSubmit川.map(() => 'unauthenticated').merge(
        submit川.map(() => 'loading').merge(
          submitted川.map(() => 'completed').mapError(() => 'error')
        )
      )
    ).toProperty()

    const scoreboard川       = (
      Bacon.once().merge(submitted川).merge(reload口).flatMap(
        () => Bacon.fromPromise(scoreboard(data))
      )
    )
    const scoreboardResult川 = scoreboard川.toProperty(null)
    const scoreboardData川   = scoreboardResult川.map(
      result => result && result.data
    )
    const scoreboardStatus川 = (
      scoreboard川
      .map(() => 'completed')
      .mapError(() => 'error')
      .merge(submitted川.merge(reload口).map(() => 'loading'))
      .toProperty('loading')
    )
    const scoreboardError川  = (
      scoreboard川
      .errors()
      .mapError(error => error)
      .toProperty(null)
    )

    const state川 = Bacon.combineTemplate({
      data: scoreboardData川,
      meta: {
        scoreboard: {
          status: scoreboardStatus川,
          error: scoreboardError川,
        },
        submission: {
          status: submissionStatus川,
          error:  submissionError川,
          record: submissionData川,
          rank:   submissionRank川,
        }
      }
    })

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
    scoreboard,
    Ranking,
  }
}

export default Online
