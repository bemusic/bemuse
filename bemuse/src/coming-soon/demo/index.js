import './style.scss'

import $ from 'jquery'
import DndResources from 'bemuse/resources/dnd-resources'
import SamplingMaster from 'bemuse/sampling-master'
import ctx from 'bemuse/audio-context'
import { Compiler, Notes, Reader, SongInfo, Timing } from 'bms'

import template from './template.jade'

export function main(element) {
  $(element).text('Technical Demo!').on('click', handler)

  function handler() {
    ui()
    $(element).off('click', handler)
    $(element).hide()
    return false
  }

  function ui() {
    const el = $(template()).appendTo('body')
    el.find('.js-play').hide()
    el.on('dragover', () => false).on('drop', (e) => {
      e.preventDefault()
      const dndLoader = new DndResources(e.originalEvent)
      go(dndLoader, el)
      return false
    })
  }
}

async function go(loader, element) {
  const master = new SamplingMaster(ctx)
  const $log = element.find('.js-log')
  const $play = element.find('.js-play').hide()
  const $sampler = element.find('.js-sampler')

  log('Loading file list')
  const list = await loader.fileList
  const bmsFile = list.filter((f) => f.match(/\.(?:bms|bme|bml|pms)$/i))[0]
  log('Loading ' + bmsFile)

  const loadedFile = await loader.file(bmsFile)
  const arraybuffer = await loadedFile.read()
  const buffer = Buffer.from(new Uint8Array(arraybuffer))
  const text = await Reader.readAsync(buffer)
  const chart = Compiler.compile(text).chart
  const timing = Timing.fromBMSChart(chart)
  const notes = Notes.fromBMSChart(chart)
  const info = SongInfo.fromBMSChart(chart)
  $('<pre wrap></pre>').text(JSON.stringify(info, null, 2)).appendTo($sampler)
  log('Loading samples')
  const loadedSamples = await loadSamples(notes, chart)
  log('Click the button to play!')
  await waitForPlay()
  void (function () {
    master.unmute()
    for (const note of notes.all()) {
      setTimeout(() => {
        const sample = loadedSamples[note.keysound]
        if (!sample) {
          console.log('warn: unknown sample ' + note.keysound)
          return
        }
        const span = $('<span></span>')
          .text('[' + note.keysound + '] ')
          .appendTo($sampler)
        const instance = sample.play()
        $sampler[0].scrollTop = $sampler[0].scrollHeight
        instance.onstop = function () {
          span.addClass('is-off')
        }
      }, timing.beatToSeconds(note.beat) * 1000)
    }
    return false
  })()

  function waitForPlay() {
    return new Promise(function (resolve) {
      $play.show()
      $play.on('click', () => {
        resolve()
        $play.hide()
      })
    })
  }

  function log(t) {
    $log.text(t)
  }

  function loadSamples(_notes, _chart) {
    const samples = {}
    const promises = []
    let completed = 0

    for (const note of _notes.all()) {
      const keysound = note.keysound
      if (!(keysound in samples)) {
        samples[keysound] = null
        promises.push(async () => {
          try {
            const blob = await loadKeysound(
              _chart.headers.get('wav' + keysound)
            )
            const sample = await master.sample(blob)
            samples[keysound] = sample
            log('[loaded ' + ++completed + '/' + promises.length + ' samples]')
          } catch (e) {
            console.error('Unable to load ' + keysound + ': ' + e)
          }
        })
      }
    }

    return Promise.all(promises).then(() => samples)
  }

  function loadKeysound(name) {
    if (typeof name !== 'string') return Promise.reject(new Error('Empty name'))
    return loader
      .file(name)
      .catch(() => loader.file(name.replace(/\.\w+$/, '.ogg')))
      .catch(() => loader.file(name.replace(/\.\w+$/, '.mp3')))
      .catch(() => loader.file(name.replace(/\.\w+$/, '.wav')))
      .then((file) => file.read())
  }
}
