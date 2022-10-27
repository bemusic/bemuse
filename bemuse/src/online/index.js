import * as DataStore from './data-store'
import * as Level from './level'

import {
  INITIAL_OPERATION_STATE,
  completedStateTransition,
  isWaiting,
  operationState川,
  transition川FromPromise,
} from './operations'

import Bacon from 'baconjs'
import Immutable from 'immutable'
import _ from 'lodash'
import id from './id'

export function Online(service) {
  const user口 = new Bacon.Bus()
  const seen口 = new Bacon.Bus()
  const submitted口 = new Bacon.Bus()

  const user川 = user口
    // https://github.com/baconjs/bacon.js/issues/536
    .toProperty(null)
    .map((user) => user || service.getCurrentUser())

  async function signUp(options) {
    const user = await service.signUp(options)
    user口.push(user)
    return user
  }

  async function logIn(options) {
    const user = await service.logIn(options)
    user口.push(user)
    return user
  }

  function changePassword(options) {
    return Promise.resolve(service.changePassword(options))
  }

  function logOut() {
    return service.logOut().then(() => user口.push(null))
  }

  async function submitScore(info) {
    const record = await service.submitScore(info)
    submitted口.push(record)
    return record
  }

  function getScoreboard(level) {
    return service.retrieveScoreboard(level)
  }

  const allSeen川 = allSeen川ForJustSeen川(seen口)
  const records川 = user川
    .flatMapLatest(records川ForUser)
    .toProperty(DataStore.INITIAL_STATE)

  const dispose = records川.onValue(() => {})

  function allSeen川ForJustSeen川(justSeen川) {
    return justSeen川
      .bufferWithTime(138)
      .scan(new Immutable.Map(), (map, seen) =>
        map.merge(_.zipObject(seen.map(id), seen))
      )
      .map((map) => map.valueSeq())
      .skipDuplicates(Immutable.is)
      .map((seq) => seq.toJS())
  }

  function records川ForUser(user) {
    const seen = {}

    {
      const action川 = Bacon.mergeAll(
        // Need to convert a property to EventStream to work around the
        // first-subscriber-only problem.
        allSeen川.toEventStream().delay(0).flatMap(fetch),
        submitted口.map((record) =>
          DataStore.put(id(record), completedStateTransition(record))
        )
      )
      return DataStore.store川(action川)
    }

    function fetch(levels) {
      const levelsToFetch = levels.filter((level) => !seen[id(level)])
      for (const level of levelsToFetch) {
        seen[id(level)] = true
      }
      const promise =
        user && levelsToFetch.length > 0
          ? service.retrieveMultipleRecords(levelsToFetch)
          : Promise.resolve([])
      return Bacon.fromPromise(
        promise
          .then(function (results) {
            const loadedRecords = _.zipObject(
              results.map(id),
              results.map(completedStateTransition)
            )
            const nullResults = _.zipObject(
              levelsToFetch.map(id),
              levelsToFetch.map(() => completedStateTransition(null))
            )
            const transitions = _.defaults(loadedRecords, nullResults)
            return DataStore.putMultiple(transitions)
          })
          .catch(function (e) {
            console.error('Cannot fetch levels:', e)
            return DataStore.putMultiple({})
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
      const self川 = rankingModel川
        .flatMapLatest((model) => model.self川)
        .toProperty(INITIAL_OPERATION_STATE)
      const scoreboardTrigger川 = rankingModel川.flatMapLatest(
        (model) => model.scoreboardTrigger川
      )
      const scoreboard川 = getScoreboardState川(scoreboardTrigger川)
      const state川 = Bacon.combineTemplate({
        self: self川,
        scoreboard: scoreboard川,
      }).map(conformState)
      return {
        state川,
        resubmit: () => retrySelf口.push(),
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

    function rankingModelForUser(user) {
      if (!user) return unauthenticatedRankingModel()
      return data.score ? submissionModel(user) : viewRecordModel(user)
    }

    function unauthenticatedRankingModel() {
      return {
        self川: Bacon.constant({
          status: 'unauthenticated',
          error: null,
          record: null,
        }),
        scoreboardTrigger川: Bacon.once({ force: false }),
      }
    }

    function submissionModel(user) {
      const self川 = submitScoreState川(user)
      const selfDone川 = self川
        .toEventStream()
        .filter((state) => !isWaiting(state))
      return {
        self川,
        scoreboardTrigger川: selfDone川.map(() => ({ force: true })),
      }
    }

    function viewRecordModel(user) {
      return {
        self川: getRecordState川(user),
        scoreboardTrigger川: asap川({ force: false }),
      }
    }

    function getScoreboardState川(trigger川) {
      return operationState川(
        trigger川
          .merge(retryScoreboard口)
          .flatMapLatest(() => transition川FromPromise(getScoreboard(level)))
      )
    }

    function getRecordState川(user) {
      return operationState川(
        asap川()
          .merge(retrySelf口)
          .flatMapLatest(() =>
            transition川FromPromise(service.retrieveRecord(level, user))
          )
      )
    }

    function submitScoreState川(user) {
      return operationState川(
        asap川()
          .merge(retrySelf口)
          .flatMapLatest(() => transition川FromPromise(submitScore(data)))
      )
    }
  }

  function seen(level) {
    return seen口.push(level)
  }

  function asap川(value) {
    return Bacon.later(0, value)
  }

  return {
    user川,
    records川,
    signUp,
    logIn,
    logOut,
    changePassword,
    submitScore,
    scoreboard: getScoreboard,
    Ranking,
    seen,
    dispose,
  }
}

export default Online
