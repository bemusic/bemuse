import * as Music from './music'

import $ from 'jquery'
import { Bus } from 'baconjs'
import ExperimentScene from './ui/ExperimentScene'
import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { connect } from 'bemuse/flux'

export function main(bootContext) {
  bootContext.setStatus('Loading song')
  const state口 = new Bus()

  const state川 = state口.scan(
    {
      loading: true,
      started: false,
      finished: false,
      listening: false,
      numSamples: 0,
      latency: 0,
    },
    (state, change) => _.assign({}, state, change)
  )

  const ConnectedExperimentScene = connect(state川)(ExperimentScene)

  const scene = React.createElement(ConnectedExperimentScene, {
    onStart: () => {
      play()
      postMessage({ type: 'calibration-started' })
      addEventListener('beforeunload', () => {
        postMessage({ type: 'calibration-closed' })
      })
    },
  })

  ReactDOM.render(scene, $('<div></div>').appendTo('body')[0])

  let play

  function postMessage(data) {
    if (window.opener) {
      window.opener.postMessage(data, '*')
    }
  }

  function getLatency(samples) {
    const data = samples.map((d) => d[1])
    data.sort((a, b) => a - b)
    let count = 0
    let sum = 0
    const start = Math.floor((data.length * 1) / 7)
    for (let i = start; i < (data.length * 6) / 7; i++) {
      count += 1
      sum += data[i]
    }
    return Math.round((sum / count) * 1000)
  }

  return Music.load().then((music) => {
    const bound = 56
    const samples = []
    state口.push({ loading: false })
    play = () => {
      state口.push({ started: true })
      const remote = music({
        a() {
          const latency = Math.max(0, getLatency(samples))
          state口.push({ finished: true, latency })
          postMessage({ latency: latency })
        },
      })
      const tap = () => {
        samples.push(remote.getSample())
        remote.progress(Math.min(1, samples.length / bound))
        if (samples.length >= bound) remote.ok()
        state口.push({ numSamples: samples.length })
      }
      setTimeout(() => {
        state口.push({ listening: true })
        window.addEventListener('keydown', (e) => {
          if (e.which !== 32) return
          e.preventDefault()
          tap()
        })
        window.addEventListener('touchstart', (e) => {
          if (e.touches.length !== 1) return
          e.preventDefault()
          tap()
        })
      }, 6675)
    }
  })
}
