
import '../../polyfill'

import $ from 'jquery'
import co from 'co'
import SamplingMaster from '../../sampling-master'
import readBlob from '../../read-blob'
import ctx from 'audio-context'

import Compiler from 'bms/compiler'
import Timing from 'bms/timing'
import Notes from 'bms/notes'

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
      let dndLoader = new DndLoader(e.originalEvent)
      go(dndLoader, el)
      return false
    })
  }

}

class DndLoader {
  constructor(event) {
    this._files = this._getFiles(event)
  }
  _getFiles(event) {
    let out = []
    let promises = []
    for (let item of Array.from(event.dataTransfer.items)) {
      promises.push(this._readItem(item, out))
    }
    return Promise.all(promises).then(() => out)
  }
  _readItem(item, out) {
    return new Promise((resolve, reject) => {
      let entry = item.webkitGetAsEntry && item.webkitGetAsEntry()
      if (entry) {
        resolve(this._readEntry(entry, out))
      } else {
        let file = item.getAsFile && item.getAsFile()
        if (file) {
          out.push(file)
          resolve()
        }
      }
      reject(new Error('unsupported API'))
    })
  }
  _readEntry(entry, out) {
    if (entry.isFile) {
      return this._readFile(entry, out)
    } else if (entry.isDirectory) {
      return this._readDirectory(entry, out)
    }
  }
  _readFile(entry, out) {
    return new Promise((resolve, reject) => {
      entry.file(file => { out.push(file); resolve() }, reject)
    })
  }
  _readDirectory(entry, out) {
    let entries = []
    return new Promise((resolve, reject) => {
      let reader = entry.createReader()
      let read = () => reader.readEntries(results => {
        console.log(results.length)
        if (results.length === 0) {
          resolve()
        } else {
          entries.push(...Array.from(results))
          read()
        }
      }, reject)
      read()
    }).then(() =>
      Promise.map(entries, entry => this._readEntry(entry, out)))
  }
  file(name) {
    return this._files.then(function(files) {
      for (let file of files) {
        if (file.name.toLowerCase() === name.toLowerCase()) {
          return file
        }
      }
      throw new Error('unable to find ' + name)
    })
  }
  get fileList() {
    return Promise.resolve(this._files.map(f => f.name))
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
    let bms = yield loader.file(bmsFile)
    let text = yield readBlob(bms).as('text')
    let chart = Compiler.compile(text).chart
    var timing = Timing.fromBMSChart(chart)
    var notes = Notes.fromBMSChart(chart)
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
  }

}
