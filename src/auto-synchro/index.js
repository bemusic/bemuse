
import '../polyfill'
import * as Music from './music'
import Vue from 'vue'
import template from './experiment/template.jade'
import './experiment/style.scss'
import $ from 'jquery'

export function main() {

  let el = $('<div></div>').appendTo('body')

  function send(device, data) {
    return new Promise((resolve) => {
      $.getScript('//www.parsecdn.com/js/parse-1.3.4.min.js', () => {
        Parse.initialize('JPhEf2EisJuKiuSOD50p6De7ZW7iwKVPakcbMo0h',
                          'jd0W1cM8Kpn5jTBUp8emJJSimjfYmpP5o0tSpH71')
        let SurveyResult = Parse.Object.extend('SurveyResult')
        resolve(new SurveyResult().save({
          agent: navigator.userAgent,
          device: device,
          samples: data,
        }))
      })
    })
  }

  let data = {
        showLoading: true,
        showStart: false,
        showSending: false,
        showStarted: false,
        showThank: false,
        numSamples: 0,
        showCollect: true,
      }
  let play
  let music = Music.load().then(music => {
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
          data.showSending = true
          send(data.device, samples).then(() => {
            data.showThank = true
          }, () => { alert('Oops cannot send!') })
        }
      })
      let tap = () => {
        samples.push(remote.getSample())
        remote.progress(Math.min(1, samples.length / bound))
        if (samples.length >= bound) remote.ok()
        data.numSamples = samples.length
      }
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
