import * as Music from './music'

import { Subject, scan } from 'rxjs'

import ExperimentScene from './ui/ExperimentScene'
import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

export async function main(bootContext: {
  setStatus: (status: string) => void
}) {
  bootContext.setStatus('Loading song')
  const state口 = new Subject()

  const state川 = state口.pipe(
    scan((state, change) => _.assign({}, state, change), {
      loading: true,
      started: false,
      finished: false,
      listening: false,
      numSamples: 0,
      latency: 0,
    })
  )

  let play: (() => void) | null = null

  const scene = (
    <ExperimentScene
      stateStream={state川}
      onStart={() => {
        if (play) {
          play()
        }
        postMessage({ type: 'calibration-started' })
        addEventListener('beforeunload', () => {
          postMessage({ type: 'calibration-closed' })
        })
      }}
    />
  )

  const container = document.createElement('div')
  document.body.appendChild(container)
  ReactDOM.render(scene, container)

  function postMessage(data: object) {
    if (window.opener) {
      window.opener.postMessage(data, '*')
    }
  }

  function getLatency(samples: readonly Music.SampleRecord[]) {
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

  const music = await Music.load()
  const bound = 56
  const samples: Music.SampleRecord[] = []
  state口.next({ loading: false })
  play = () => {
    state口.next({ started: true })
    const remote = music({
      a() {
        const latency = Math.max(0, getLatency(samples))
        state口.next({ finished: true, latency })
        postMessage({ latency: latency })
      },
    })
    const tap = () => {
      samples.push(remote.getSample())
      remote.progress(Math.min(1, samples.length / bound))
      if (samples.length >= bound) remote.ok()
      state口.next({ numSamples: samples.length })
    }
    setTimeout(() => {
      state口.next({ listening: true })
      window.addEventListener('keydown', (e) => {
        if (e.code !== 'Space') return
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
}
