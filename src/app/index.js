
import '../polyfill'

import $ from 'jquery'
import storage from '../cachier'
import ctx from 'audio-context'

export function main() {

  button('Download and save mp3', function() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/Reminiscentia_Master.mp3', true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      alert('BLOB LOADED')
      storage.save('bass.mp3', xhr.response)
      .then(function() {
        alert('OK!')
      }, function(e) {
        alert(e)
      })
    }
    xhr.send(null)
  })

  let aud = null

  button('Load', function() {
    storage.load('bass.mp3')
    .then(function(result) {
      var blob = result.blob
      console.log('Blob load')
      let fr = new FileReader()
      fr.onload = function() {
        console.log('File read')
        ctx.decodeAudioData(fr.result,
          function(buf) {
            aud = buf
            alert('Ok?!')
          },
          function() {
            alert('Fail')
          })
      }
      fr.readAsArrayBuffer(blob)
    })
    .done()
  })

  button('Play', function() {
    let node = ctx.createBufferSource(aud)
    node.buffer = aud
    node.connect(ctx.destination)
    node.start(ctx.currentTime)
  })

}

function button(text, cb) {
  $('<button></button>').text(text).click(cb).appendTo('body')
}

