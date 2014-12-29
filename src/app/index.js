
import '../polyfill'

import $ from 'jquery'
import co from 'co'
import storage from '../cachier'

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

import ctx from 'audio-context'
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
})

button('Play', function() {
  let node = ctx.createBufferSource(aud)
  node.buffer = aud
  node.connect(ctx.destination)
  node.start(ctx.currentTime)
})

function button(text, cb) {
  $('<button></button>').text(text).click(cb).appendTo('body')
}

console.log(x => x + 1)

function wait() {
  return new Promise(resolve => setTimeout(resolve, 3000))
}

let lol = co.wrap(function* lol() {
  yield wait()
  $('body').append('AWESOME')
})

lol()

