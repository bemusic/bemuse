
import * as Music from './music'
import Vue from 'vue'
import template from './experiment/template.jade'
import './experiment/style.scss'
import $ from 'jquery'

export function main() {

  let el = $('<div></div>').appendTo('body')

  let data = {
        showLoading: true,
        showStart: false,
        showSending: false,
        showStarted: false,
        showThank: false,
        numSamples: 0,
        showCollect: true,
        showCollection: false,
        latency: 0,
      }

  let play

  function getLatency(samples) {
    let data = samples.map(([a, b]) => b)
    data.sort((a, b) => a - b)
    let count = 0
    let sum = 0
    let start = Math.floor(data.length * 1 / 7)
    for (let i = start; i < data.length * 6 / 7; i ++) {
      count += 1
      sum += data[i]
    }
    return Math.round(sum / count * 1000)
  }

  Music.load().then(music => {
    let bound = 56
    let samples = []
    data.showLoading = false
    data.showStart = true
    play = () => {
      data.showStart = false
      data.showStarted = true
      let remote = music({
        a() {
          data.showCollect = false
          data.latency = getLatency(samples)
          data.showThank = true
        }
      })
      let tap = () => {
        samples.push(remote.getSample())
        remote.progress(Math.min(1, samples.length / bound))
        if (samples.length >= bound) remote.ok()
        data.numSamples = samples.length
      }
      setTimeout(() => {
        data.showCollection = true
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

  new Vue({
    el: el[0],
    template: template(),
    data: data,
    methods: {
      start() {
        play()
      }
    },
  })

}
