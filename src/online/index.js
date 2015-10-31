
import Bacon from 'baconjs'
import _     from 'lodash'

import id from './id'
import OnlineService from './online-service'
import * as Level     from './level'
import * as DataStore from './data-store'

import {
  loadingStateTransition,
  completedStateTransition,
  errorStateTransition,
  INITIAL_OPERATION_STATE,
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

  function getScoreboard(descriptor) {
    return service.retrieveScoreboard(descriptor)
  }

  const putRecord口  = new Bacon.Bus()
  const wantRecord口 = new Bacon.Bus()
  const seen口       = new Bacon.Bus()
  const records川    = DataStore.store川(putRecord口)

  const putScoreboard口  = new Bacon.Bus()
  const wantScoreboard口 = new Bacon.Bus()
  const scoreboards川    = DataStore.store川(putScoreboard口)

  const dispose = fetch川().flatMap(f => f()).onValue(() => {})

  function fetch川() {

    return (
      Bacon.mergeAll(
        fetchWhen(wantRecord口, records川, fetchRecord),
        fetchWhen(wantScoreboard口, scoreboards川, fetchScoreboard),
        fetchSeen(),
      ).filter(f => !!f)
    )

    function fetchWhen(want川, dataStore川, fetch) {
      return (
        Bacon.when([want川, dataStore川], (info, data) =>
          !DataStore.has(data, id(info)) && fetch(info)
        )
      )
    }

    function fetchRecord(info) {
      return () => fetchInto(putRecord口, service.retrieveRecord(info), info)
    }

    function fetchScoreboard(info) {
      return () => fetchInto(putScoreboard口, service.retrieveScoreboard(info), info)
    }

    function fetchSeen() {
      let seen川 = seen口.bufferWithTime(138)
      return Bacon.when([seen川, records川], (infos, data) => {
        let unseen = infos.filter(info => !DataStore.has(data, id(info)))
        return fetchMultipleRecords(unseen)
      })
    }

    function fetchMultipleRecords(infos) {
      return () => fetchIntoMultiple(putRecord口, service.retrieveMultipleRecords(infos), infos)
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

  function asap川 (value) {
    return Bacon.later(0, value)
  }

  function fetchInto(口, promise, info) {
    return transition川FromPromise(promise).doAction(transition => {
      口.push(DataStore.put(id(info), transition))
    })
  }

  function fetchIntoMultiple(口, promise, infos) {

    口.push(DataStore.putMultiple(
      transitions(infos, loadingStateTransition)
    ))

    promise.then(
      records => {
        口.push(DataStore.putMultiple(Object.assign({ },
          transitions(infos, () => INITIAL_OPERATION_STATE),
          transitions(records, completedStateTransition),
        )))
      },
      error => {
        口.push(DataStore.putMultiple(Object.assign({ },
          transitions(infos, () => errorStateTransition(error)),
        )))
      },
    )
    .done()

    function transitions(items, toTransition) {
      let changes = { }
      for (let item of items) changes[id(item)] = toTransition(item)
      return changes
    }
  }

  function seen({ md5, playMode }) {
    return seen口.push({ md5, playMode })
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
    dispose,
  }
}

export default Online
