import * as Music from './music'

import ExperimentScene, { ExperimentState } from './ui/ExperimentScene'

import React from 'react'
import { Subject } from 'rxjs'
import _ from 'lodash'
import { createRoot } from 'react-dom/client'

export async function main(bootContext: {
  setStatus: (status: string) => void
}) {
  bootContext.setStatus('Loading song')
  const state口 = new Subject<ExperimentState>()

  const scene = (
    <ExperimentScene
      stateStream={state口.asObservable()}
      onStart={() => {
        play()
        postMessage({ type: 'calibration-started' })
        addEventListener('beforeunload', () => {
          postMessage({ type: 'calibration-closed' })
        })
      }}
    />
  )

  const container = document.createElement('div')
  document.body.appendChild(container)
  createRoot(container).render(scene)

  function postMessage(data: object) {
    if (window.opener) {
      window.opener.postMessage(data, 'https://bemuse.ninja')
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
  state口.next({ type: 'ready' })
  const play = () => {
    state口.next({ type: 'started' })
    const remote = music({
      a() {
        const latency = Math.max(0, getLatency(samples))
        state口.next({ type: 'finished', latency, numSamples: samples.length })
        postMessage({ latency: latency })
        state口.complete()
      },
    })
    const tap = () => {
      samples.push(remote.getSample())
      remote.progress(Math.min(1, samples.length / bound))
      if (samples.length >= bound) remote.ok()
      state口.next({ type: 'listening', numSamples: samples.length })
    }
    setTimeout(() => {
      state口.next({ type: 'listening', numSamples: 0 })
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
