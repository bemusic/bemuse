import './style.scss'

import $ from 'jquery'
import { Compiler, Notes, Reader, SongInfo, Timing } from 'bms'
import DndResources from 'bemuse/resources/dnd-resources'
import SamplingMaster from 'bemuse/sampling-master'
import ctx from 'bemuse/audio-context'

import template from './template.jade'

export function main(element) {
  $(element)
    .text('Technical Demo!')
    .on('click', handler)

  function handler() {
    ui()
    $(element).off('click', handler)
    $(element).hide()
    return false
  }

  function ui() {
    var el = $(template()).appendTo('body')
    el.find('.js-play').hide()
    el.on('dragover', () => false).on('drop', e => {
      e.preventDefault()
      let dndLoader = new DndResources(e.originalEvent)
      go(dndLoader, el)
      return false
    })
  }
}

async function go(loader, element) {
  let master = new SamplingMaster(ctx)
  let $log = element.find('.js-log')
  let $play = element.find('.js-play').hide()
  let $sampler = element.find('.js-sampler')

  log('Loading file list')
  let list = await loader.fileList
  let bmsFile = list.filter(f => f.match(/\.(?:bms|bme|bml|pms)$/i))[0]
  log('Loading ' + bmsFile)

  let loadedFile = await loader.file(bmsFile)
  let arraybuffer = await loadedFile.read()
  let buffer = Buffer.from(new Uint8Array(arraybuffer))
  let text = await Promise.promisify(Reader.readAsync)(buffer)
  let chart = Compiler.compile(text).chart
  var timing = Timing.fromBMSChart(chart)
  var notes = Notes.fromBMSChart(chart)
  var info = SongInfo.fromBMSChart(chart)
  $('<pre wrap></pre>')
    .text(JSON.stringify(info, null, 2))
    .appendTo($sampler)
  log('Loading samples')
  var loadedSamples = await loadSamples(notes, chart)
  log('Click the button to play!')
  await waitForPlay()
  void (function() {
    master.unmute()
    for (let note of notes.all()) {
      setTimeout(() => {
        let sample = loadedSamples[note.keysound]
        if (!sample) {
          console.log('warn: unknown sample ' + note.keysound)
          return
        }
        let span = $('<span></span>')
          .text('[' + note.keysound + '] ')
          .appendTo($sampler)
        let instance = sample.play()
        $sampler[0].scrollTop = $sampler[0].scrollHeight
        instance.onstop = function() {
          span.addClass('is-off')
        }
      }, timing.beatToSeconds(note.beat) * 1000)
    }
    return false
  })()

  function waitForPlay() {
    return new Promise(function(resolve) {
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
    var samples = {}
    var promises = []
    let completed = 0

    for (let note of _notes.all()) {
      let keysound = note.keysound
      if (!(keysound in samples)) {
        samples[keysound] = null
        promises.push(
          loadKeysound(_chart.headers.get('wav' + keysound))
            .then(blob => master.sample(blob))
            .then(sample => (samples[keysound] = sample))
            .catch(e => console.error('Unable to load ' + keysound + ': ' + e))
            .tap(() =>
              log(
                '[loaded ' + ++completed + '/' + promises.length + ' samples]'
              )
            )
        )
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
      .then(file => file.read())
  }
}
