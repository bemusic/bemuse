
import * as Music       from './music'
import React            from 'react'
import ExperimentScene  from './ui/experiment-scene.jsx'
import $                from 'jquery'
import State            from 'bemuse/utils/state'

export function main() {

  const state = new State({
    showLoading: true,
    showStart: false,
    showSending: false,
    showStarted: false,
    showThank: false,
    numSamples: 0,
    showCollect: true,
    showCollection: false,
    latency: 0,
  })

  const scene = React.createElement(ExperimentScene, {
    state:    state,
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
    state.set({
      showLoading: false,
      showStart: true,
    })
    play = () => {
      state.set({
        showStart: false,
        showStarted: false,
      })
      let remote = music({
        a() {
          state.set({
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
        state.set({
          numSamples: samples.length,
        })
      }
      setTimeout(() => {
        state.set({
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
