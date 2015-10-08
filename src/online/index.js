
import Bacon from 'baconjs'
import _     from 'lodash'

import id from './id'
import OnlineService from './online-service'
import { DataStore, put, multiPutBuilder, hasState } from './data-store'
import { transition川FromPromise, operationState川 } from './operations'
import { loadingStateTransition, completedStateTransition, errorStateTransition, INITIAL_OPERATION_STATE } from './operations'

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
  const records     = new DataStore(putRecord口)

  const putScoreboard口  = new Bacon.Bus()
  const wantScoreboard口 = new Bacon.Bus()
  const scoreboards     = new DataStore(putScoreboard口)

  const dispose = fetch川().flatMap(f => f()).onValue(() => {})

  function fetch川() {

    return (
      Bacon.mergeAll(
        fetchWhen(wantRecord口, records, fetchRecord),
        fetchWhen(wantScoreboard口, scoreboards, fetchScoreboard),
        fetchSeen(),
      ).filter(f => !!f)
    )

    function fetchWhen(want川, dataStore, fetch) {
      return (
        Bacon.when([want川, dataStore.data川], (info, data) =>
          !hasState(data, id(info)) && fetch(info)
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
      return Bacon.when([seen川, records.data川], (infos, data) => {
        let unseen = infos.filter(info => !hasState(data, id(info)))
        return fetchMultipleRecords(unseen)
      })
    }

    function fetchMultipleRecords(infos) {
      return () => {
        let promise = service.retrieveMultipleRecords(infos)
        putRecord口.push(multiPutBuilder()
          .with(infos, id, () => loadingStateTransition())
          .build()
        )
        promise.then(
          records => {
            putRecord口.push(multiPutBuilder()
              .with(infos,   id, () => INITIAL_OPERATION_STATE)
              .with(records, id, completedStateTransition)
              .build()
            )
          },
          error => {
            putRecord口.push(multiPutBuilder()
              .with(infos,   id, () => errorStateTransition(error))
              .build()
            )
          },
        )
        .done()
      }
    }
  }

  function Ranking(data) {

    const resubmit口 = new Bacon.Bus()
    const reload口   = new Bacon.Bus()

    return construct()

    function construct() {

      let record     = getRecordPart()
      let scoreboard = getScoreboardPart(getScoreboardIntents(record))

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

    function getRecordPart() {

      let operation川            = (
        // We need to have it trigger on `resubmit口`, but cannot simply use
        // `Bacon.when`, because of a weird issue: https://github.com/baconjs/bacon.js/issues/640
        user川.combine(resubmit口.toProperty(null), user => user)
        .map(getOperationFunction)
      )
      let operationTransition川  = operation川.flatMapLatest(performWithOperation)
      let notSubmitting川        = operation川.filter(f => f !== submit川)
      let submitted川            = operationTransition川.filter(isFinishedSubmitting)

      let transition川           = operationTransition川.map(({ transition }) => transition)
      let state川                = operationState川(transition川)

      return { state川, notSubmitting川, submitted川 }

      function getOperationFunction(user) {
        if (user) {
          if (data.score) {
            return submit川
          } else {
            return getRecord川
          }
        } else {
          return getUnauthenticated川
        }
      }

      function submit川() {
        return fetchInto(putRecord口, submitScore(data), data)
      }

      function getRecord川() {
        wantRecord口.push(data)
        return records.state川(id(data))
      }

      function getUnauthenticated川() {
        return Bacon.once({
          status: 'unauthenticated',
          error:  null,
          record: null,
        })
      }

      function isFinishedSubmitting({ operation, transition }) {
        return operation === submit川 && (
          transition.status !== 'loading' && transition.status !== 'unauthenticated'
        )
      }
    }

    function getScoreboardPart(intents) {

      let { get川, load川 } = intents

      let operation川 = Bacon.mergeAll(
        get川.map(() => getScoreboard川),
        load川.map(() => loadScoreboard川)
      )

      let transition川 = operation川.flatMapLatest(f => f())
      let state川      = operationState川(transition川)

      return { state川 }

      function getScoreboard川() {
        wantScoreboard口.push(data)
        return scoreboards.state川(id(data))
      }

      function loadScoreboard川() {
        return fetchInto(putScoreboard口, getScoreboard(data), data)
      }

    }

    function getScoreboardIntents(recordPart) {
      return {
        get川:   recordPart.notSubmitting川,
        load川:  recordPart.submitted川.merge(reload口),
      }
    }

    function performWithOperation(operation) {
      return operation().map(transition => ({ operation, transition }))
    }
  }

  function fetchInto(口, promise, info) {
    return transition川FromPromise(promise).doAction(transition => {
      口.push(put(id(info), transition))
    })
  }

  function seen({ md5, playMode }) {
    return seen口.push({ md5, playMode })
  }

  return {
    user川,
    records川: records.data川,
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
