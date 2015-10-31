
import Bacon      from 'baconjs'
import _          from 'lodash'

import id from './id'
import OnlineService from './online-service'
import * as Level     from './level'
import * as DataStore from './data-store'

import {
  INITIAL_OPERATION_STATE,
  completedStateTransition,
  transition川FromPromise,
  operationState川,
  isWaiting,
} from './operations'

export function Online() {

  const service = new OnlineService()

  const user口 = new Bacon.Bus()
  const user川 = (
    user口
    // https://github.com/baconjs/bacon.js/issues/536
    .toProperty(null)
    .map(user => user || service.getCurrentUser())
  )

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

  function getScoreboard(level) {
    return service.retrieveScoreboard(level)
  }

  const seen口       = new Bacon.Bus()
  const records川    = user川.flatMapLatest(records川ForUser)

  function records川ForUser(user) {
    let seen = { }

    {
      const bufferedSeen川 = seen口.bufferWithTime(138)
      const action川 = bufferedSeen川.flatMap(fetch)
      return DataStore.store川(action川)
    }

    function fetch (levels) {
      let levelsToFetch = levels.filter(level => !seen[id(level)])
      for (let level of levelsToFetch) {
        seen[id(level)] = true
      }
      return Bacon.fromPromise(service.retrieveMultipleRecords(levels)
        .then(function (results) {
          let recordsToPut = { }
          for (let record of results) {
            recordsToPut[id(record)] = completedStateTransition(record)
          }
          return DataStore.putMultiple(recordsToPut)
        })
        .catch(function () {
          return DataStore.putMultiple({ })
        })
      )
    }
  }

  function Ranking(data) {

    const level = Level.fromObject(data)
    const retrySelf口 = new Bacon.Bus()
    const retryScoreboard口 = new Bacon.Bus()

    {
      const rankingModel川 = user川.map(rankingModelForUser)
      const self川 = (rankingModel川
        .flatMapLatest(model => model.self川)
        .toProperty(INITIAL_OPERATION_STATE)
      )
      const scoreboardTrigger川 = (rankingModel川
        .flatMapLatest(model => model.scoreboardTrigger川)
      )
      const scoreboard川 = getScoreboardState川(scoreboardTrigger川)
      const state川 = (
        Bacon.combineTemplate({
          self: self川,
          scoreboard: scoreboard川,
        })
        .map(conformState)
      )
      return {
        state川,
        resubmit:         () => retrySelf口.push(),
        reloadScoreboard: () => retryScoreboard口.push(),
      }
    }

    // Make the state conform the old API. We should remove this in the future.
    function conformState(state) {
      return {
        data: state.scoreboard.value && state.scoreboard.value.data,
        meta: {
          scoreboard: _.omit(state.scoreboard, 'value'),
          submission: state.self,
        },
      }
    }

    function rankingModelForUser (user) {
      if (!user) return unauthenticatedRankingModel()
      return (data.score
        ? submissionModel(user)
        : viewRecordModel(user)
      )
    }

    function unauthenticatedRankingModel () {
      return {
        self川: Bacon.constant({
          status: 'unauthenticated',
          error:  null,
          record: null,
        }),
        scoreboardTrigger川: Bacon.once({ force: false })
      }
    }

    function submissionModel (user) {
      const self川     = submitScoreState川(user)
      const selfDone川 = self川.toEventStream().filter(state => !isWaiting(state))
      return {
        self川,
        scoreboardTrigger川: selfDone川.map(() => ({ force: true }))
      }
    }

    function viewRecordModel (user) {
      return {
        self川: getRecordState川(user),
        scoreboardTrigger川: asap川({ force: false })
      }
    }

    function getScoreboardState川 (trigger川) {
      return operationState川(
        trigger川.merge(retryScoreboard口).flatMapLatest(
          () => transition川FromPromise(getScoreboard(level))
        )
      )
    }

    function getRecordState川 (user) {
      return operationState川(
        asap川().merge(retrySelf口).flatMapLatest(
          () => transition川FromPromise(service.retrieveRecord(level, user))
        )
      )
    }

    function submitScoreState川 (user) {
      return operationState川(
        asap川().merge(retrySelf口).flatMapLatest(
          () => transition川FromPromise(submitScore(data))
        )
      )
    }
  }

  function seen (level) {
    return seen口.push(level)
  }

  function asap川 (value) {
    return Bacon.later(0, value)
  }

  return {
    user川,
    records川,
    signUp,
    logIn,
    logOut,
    submitScore,
    scoreboard: getScoreboard,
    Ranking,
    seen,
  }
}

export default Online
