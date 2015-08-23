
import * as Music       from './music'
import React            from 'react'
import ExperimentScene  from './ui/experiment-scene.jsx'
import $                from 'jquery'
import _                from 'lodash'
import Bacon            from 'baconjs'
import { Store }        from 'bemuse/flux'

export function main() {

  const state口 = new Bacon.Bus()

  const state川 = state口.scan({
    showLoading: true,
    showStart: false,
    showStarted: false,
    showThank: false,
    numSamples: 0,
    showCollect: true,
    showCollection: false,
    latency: 0,
  }, (state, change) => _.assign({ }, state, change))

  const store = new Store(state川)

  const scene = React.createElement(ExperimentScene, {
    store:    store,
    onStart:  () => play(),
  })

  React.render(scene, $('<div></div>').appendTo('body')[0])

  let play

  function getLatency(samples) {
    let data = samples.map(d => d[1])
    data.sort((a, b) => a - b)
    let count = 0
    let sum = 0
    let start = Math.floor(data.length * 1 / 7)
    for (let i = start; i < data.length * 6 / 7; i++) {
      count += 1
      sum += data[i]
    }
    return Math.round(sum / count * 1000)
  }

  Music.load().then(music => {
    let bound = 56
    let samples = []
    state口.push({
      showLoading: false,
      showStart: true,
    })
    play = () => {
      state口.push({
        showStart: false,
        showStarted: false,
      })
      let remote = music({
        a() {
          state口.push({
            showCollect: false,
            latency: getLatency(samples),
            showThank: true,
          })
        }
      })
      let tap = () => {
        samples.push(remote.getSample())
        remote.progress(Math.min(1, samples.length / bound))
        if (samples.length >= bound) remote.ok()
        state口.push({
          numSamples: samples.length,
        })
      }
      setTimeout(() => {
        state口.push({
          showCollection: true,
        })
        window.addEventListener('keydown', e => {
          if (e.which !== 32) return
          e.preventDefault()
          tap()
        })
        window.addEventListener('touchstart', e => {
          if (e.touches.length !== 1) return
          e.preventDefault()
          tap()
        })
      }, 6675)
    }
  })

}
