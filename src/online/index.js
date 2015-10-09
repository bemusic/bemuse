
import Bacon from 'baconjs'
import _     from 'lodash'

import id from './id'
import OnlineService from './online-service'
import * as DataStore from './data-store'

import {
  loadingStateTransition,
  completedStateTransition,
  errorStateTransition,
  INITIAL_OPERATION_STATE,
  transition川FromPromise,
  operationState川,
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

    const resubmit口 = new Bacon.Bus()
    const reload口   = new Bacon.Bus()

    return construct()

    function construct() {

      let userStream川         = user川.toEventStream().delay(0)
      let unauthenticated川    = userStream川.filter(user => !user)
      let submitOrGetRecord川  = userStream川.filter(user => !!user).merge(resubmit口)
      let submit川             = submitOrGetRecord川.filter(() => !!data.score)
      let getRecord川          = submitOrGetRecord川.filter(() => !data.score)

      let record = getRecordPart({ submit川, getRecord川, unauthenticated川 })

      let getScoreboard川  = Bacon.mergeAll(getRecord川, unauthenticated川)
      let loadScoreboard川 = record.submitted川.merge(reload口)

      let scoreboard = getScoreboardPart({
        get川:   getScoreboard川,
        load川:  loadScoreboard川,
      })

      let state川 = (
        Bacon.combineTemplate({
          submission: record.state川,
          scoreboard: scoreboard.state川,
        })
        .map(conformState)
      )

      return {
        state川,
        resubmit:         () => resubmit口.push(),
        reloadScoreboard: () => reload口.push(),
      }

    }

    // Make the state conform the old API. We should remove this in the future.
    function conformState(state) {
      return {
        data: state.scoreboard.value && state.scoreboard.value.data,
        meta: {
          scoreboard: _.omit(state.scoreboard, 'value'),
          submission: state.submission,
        },
      }
    }

    function getRecordPart({ submit川, getRecord川, unauthenticated川 }) {

      let submission川     = submit川.map(() => doSubmit川())
      let nonSubmission川  = Bacon.when(
        [getRecord川],       () => doGetRecord川(),
        [unauthenticated川], () => doGetUnauthenticated川()
      )
      let transition川     = Bacon.mergeAll(submission川, nonSubmission川).flatMapLatest(川 => 川)
      let submitted川      = submission川.flatMapLatest(川 => 川).filter(isFinishedSubmitting)
      let state川          = operationState川(transition川)

      return { state川, submitted川 }

      function doSubmit川() {
        return fetchInto(putRecord口, submitScore(data), data)
      }

      function doGetRecord川() {
        wantRecord口.push(data)
        return DataStore.item川(records川, id(data))
      }

      function doGetUnauthenticated川() {
        return Bacon.once({
          status: 'unauthenticated',
          error:  null,
          record: null,
        })
        .delay(0)
      }

      function isFinishedSubmitting(transition) {
        return transition.status !== 'loading' && transition.status !== 'unauthenticated'
      }
    }

    function getScoreboardPart({ get川, load川 }) {

      let operation川 = Bacon.when(
        [get川], () => getScoreboard川,
        [load川], () => loadScoreboard川
      )

      let transition川 = operation川.flatMapLatest(f => f())
      let state川      = operationState川(transition川)

      return { state川 }

      function getScoreboard川() {
        wantScoreboard口.push(data)
        return DataStore.item川(scoreboards川, id(data))
      }

      function loadScoreboard川() {
        return fetchInto(putScoreboard口, getScoreboard(data), data)
      }

    }
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
