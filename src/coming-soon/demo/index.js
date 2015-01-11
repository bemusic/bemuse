
import '../../polyfill'

import $ from 'jquery'
import co from 'co'
import SamplingMaster from '../../sampling-master'
import readBlob from '../../read-blob'
import ctx from 'audio-context'

import Compiler from 'bms/compiler'
import Timing from 'bms/timing'
import Notes from 'bms/notes'

export function main(element) {
  function handler() {
    alert('Please drag a BMS file along with ALL samples into this page!')
    return false
  }
  $(element).text('Technical Demo').on('click', handler)
  $('body')
  .on('dragover', () => false)
  .on('drop', e => {
    $(element).off('click', handler)
    let dndLoader = new DndLoader(e.originalEvent.dataTransfer.files)
    go(dndLoader, element)
    return false
  })
}

class DndLoader {
  constructor(files) {
    this._files = [].slice.call(files)
    console.log(this._files)
  }
  file(name) {
    for (let file of this._files) {
      if (file.name.toLowerCase() === name.toLowerCase()) {
        return Promise.resolve(file)
      }
    }
    return Promise.reject(new Error('unable to find ' + name))
  }
  get fileList() {
    return Promise.resolve(this._files.map(f => f.name))
  }
}

function go(loader, element) {

  let master = new SamplingMaster(ctx)

  co(function*() {
    log('Loading file list')
    let list = yield loader.fileList
    let bmsFile = list.filter(f => f.match(/\.bm.$/i))[0]
    log('Loading ' + bmsFile)
    let bms = yield loader.file(bmsFile)
    let text = yield readBlob(bms).as('text')
    let chart = Compiler.compile(text).chart
    var timing = Timing.fromBMSChart(chart)
    var notes = Notes.fromBMSChart(chart)
    log('Loading samples')
    var samples = yield loadSamples(notes, chart)
    log('Click to play!')
    $(element).on('click', function() {
      var num = 0
      master.unmute()
      for (let note of notes.all()) {
        setTimeout(() => {
          let sample = samples[note.keysound]
          if (!sample) {
            console.log('warn: unknown sample ' + note.keysound)
            return
          }
          let span = document.createElement('span')
          let c = num++
          span.style.fontSize = '1vw'
          span.style.textAlign = 'center'
          span.style.display = 'block'
          span.style.position = 'absolute'
          span.style.left = (c % 40) * 2.5 + '%'
          span.style.top = (~~(c / 40) % 10) * 3 + 'ex'
          span.innerHTML = '[' + note.keysound + '] '
          document.body.appendChild(span)
          let instance = sample.play()
          instance.onstop = function() {
            document.body.removeChild(span)
          }
        }, timing.beatToSeconds(note.beat) * 1000)
      }
      return false
    })
  }).done()

  function log(t) {
    element.textContent = t
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
