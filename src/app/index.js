
import '../polyfill'

import $ from 'jquery'
import BemuseLoader from '../bemuse-loader'
import SamplingMaster from '../sampling-master'
import readBlob from '../read-blob'
import ctx from 'audio-context'

import Compiler from 'bms/compiler'
import Timing from 'bms/timing'
import Notes from 'bms/notes'


export function main() {

  let loader = new BemuseLoader('/music/nora2r_bbkkbkk/bbkkbkk.bemuse')
  let master = new SamplingMaster(ctx)

  loader.file('_a.bms')
  .then(bms => readBlob(bms).as('text'))
  .then(text => Compiler.compile(text))
  .get('chart')
  .then(function(chart) {
    var timing = Timing.fromBMSChart(chart)
    var notes = Notes.fromBMSChart(chart)
    var samples = { }
    var promises = []

    let completed = 0
    let status = document.createElement('span')
    document.body.appendChild(status)

    for (let note of notes.all()) {
      let keysound = note.keysound
      console.log(note)
      if (!(keysound in samples)) {
        samples[keysound] = null
        promises.push(loader.file(note.keysound + '.mp3')
          .then(blob => master.sample(blob))
          .then(sample => samples[keysound] = sample)
          .tap(() => status.textContent =
            '[loaded ' + (++completed) + '/' + promises.length + ' samples]'))
      }
    }
    var num = 0
    return Promise.all(promises).then(() => {
      button('Start', function() {
        master.unmute()
        for (let note of notes.all()) {
          setTimeout(() => {
            let sample = samples[note.keysound]
            let span = document.createElement('span')
            let c = num++
            span.style.fontSize = '50px'
            span.style.display = 'block'
            span.style.position = 'absolute'
            span.style.left = (c % 5) * 20 + '%'
            span.style.top = (~~(c / 5) % 12) * 3 + 'ex'
            span.innerHTML = '[' + note.keysound + '] '
            document.body.appendChild(span)
            let instance = sample.play()
            instance.onstop = function() {
              document.body.removeChild(span)
            }
          }, timing.beatToSeconds(note.beat) * 1000)
        }
      })
    })
  })
  .done()

  /*
  loader.file('E5.mp3').then(function(x) {
    return master.sample(x).then(function(s) {
      s.play()
      button('played')
    })
  })
  .done()
  */

}

function button(text, cb) {
  $('<button></button>').text(text).click(cb).appendTo('body')
}

