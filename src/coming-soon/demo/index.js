
import 'bemuse/polyfill'

import $ from 'jquery'
import co from 'co'

import SamplingMaster from 'bemuse/sampling-master'
import DndResources   from 'bemuse/resources/dnd-resources'
import ctx            from 'audio-context'

import Reader   from 'bms/reader'
import Compiler from 'bms/compiler'
import Timing   from 'bms/timing'
import Notes    from 'bms/notes'
import SongInfo from 'bms/song-info'

import template from './template.jade'
import './style.scss'

export function main(element) {

  $(element).text('Technical Demo!').on('click', handler)

  function handler() {
    ui()
    $(element).off('click', handler)
    $(element).hide()
    return false
  }

  function ui() {
    var el = $(template()).appendTo('body')
    el.find('.js-play').hide()
    el
    .on('dragover', () => false)
    .on('drop', e => {
      e.preventDefault()
      let dndLoader = new DndResources(e.originalEvent)
      go(dndLoader, el)
      return false
    })
  }

}

function go(loader, element) {

  let master    = new SamplingMaster(ctx)
  let $log      = element.find('.js-log')
  let $play     = element.find('.js-play').hide()
  let $sampler  = element.find('.js-sampler')

  co(function*() {
    log('Loading file list')
    let list = yield loader.fileList
    let bmsFile = list.filter(f => f.match(/\.(?:bms|bme|bml|pms)$/i))[0]
    log('Loading ' + bmsFile)

    let arraybuffer = yield (yield loader.file(bmsFile)).read()
    let buffer = new Buffer(new Uint8Array(arraybuffer))
    let text = yield Promise.promisify(Reader.readAsync)(buffer)
    let chart = Compiler.compile(text).chart
    var timing = Timing.fromBMSChart(chart)
    var notes = Notes.fromBMSChart(chart)
    var info = SongInfo.fromBMSChart(chart)
    $('<pre wrap></pre>').text(JSON.stringify(info, null, 2)).appendTo($sampler)
    log('Loading samples')
    var samples = yield loadSamples(notes, chart)
    log('Click the button to play!')
    yield waitForPlay()
    ;(function() {
      master.unmute()
      for (let note of notes.all()) {
        setTimeout(() => {
          let sample = samples[note.keysound]
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
  }).done()

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

  function loadSamples(notes, chart) {
    var samples = {}
    var promises = []
    let completed = 0

    for (let note of notes.all()) {
      let keysound = note.keysound
      if (!(keysound in samples)) {
        samples[keysound] = null
        promises.push(
          loadKeysound(chart.headers.get('wav' + keysound))
            .then(blob => master.sample(blob))
            .then(sample => samples[keysound] = sample)
            .catch(e => console.error('Unable to load ' + keysound + ': ' + e))
            .tap(() => log('[loaded ' + (++completed) + '/' + promises.length +
              ' samples]'))
        )
      }
    }

    return Promise.all(promises).then(() => samples)
  }

  function loadKeysound(name) {
    if (typeof name !== 'string') return Promise.reject(new Error('Empty name'))
    return loader.file(name)
      .catch(() => loader.file(name.replace(/\.\w+$/, '.ogg')))
      .catch(() => loader.file(name.replace(/\.\w+$/, '.mp3')))
      .catch(() => loader.file(name.replace(/\.\w+$/, '.wav')))
      .then(file => file.read())
  }

}
