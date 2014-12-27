
import '6to5/polyfill'

import $ from 'jquery'
import co from 'co'

var storage = (function() {

  var indexedDB = window.indexedDB || window.webkitIndexedDB ||
                  window.mozIndexedDB || window.OIndexedDB ||
                  window.msIndexedDB

  var connection = connect()

  function connect() {
    return new Promise(function(resolve, reject) {
      var request = indexedDB.open('cachier', 1)
      request.onupgradeneeded = function(event) {
        var db = event.target.result
        var store = db.createObjectStore('cachier', { keyPath: '_id' })
        store.transaction.oncomplete = function() {
          resolve(db)
        }
        store.transaction.onerror = function() {
          reject(new Error('Cannot upgrade database!'))
        }
      }
      request.onerror = function() {
        reject(new Error('Cannot request database!'))
      }
      request.onsuccess = function(event) {
        var db = event.target.result
        resolve(db)
      }
    })
  }

  return {
    save(key, blob, metadata) {
      return connection.then(function(db) {
        return Promise.resolve().then(function tryBlob() {
          var request = db.transaction('cachier', 'readwrite')
                .objectStore('cachier')
                .put({ _id: key, blob: blob, metadata: metadata })
          return trap(request)
        })
        .catch(function tryObject() {
          console.log('Cannot store as blob, store as data-URL instead.')
          return blobToObject(blob).then(function(object) {
            var request = db.transaction('cachier', 'readwrite')
                  .objectStore('cachier')
                  .put({ _id: key, blob: object, metadata: metadata })
            return trap(request)
          })
        })
      })
    },
    load(key) {
      return connection.then(function(db) {
        var request = db.transaction('cachier').objectStore('cachier').get(key)
        return trap(request).then(function() {
          var result = request.result
          return {
            blob: objectToBlob(result.blob),
            metadata: result.metadata,
          }
        })
      })
    },
  }

  function trap(request) {
    return new Promise(function(resolve, reject) {
      request.onerror = function() {
        reject(new Error('IndexedDB Error: ' + request.error))
      }
      request.onsuccess = function(event) {
        resolve(event)
      }
    })
  }

  function blobToObject(blob) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader()
      reader.onload = function() {
        resolve({ buffer: reader.result, type: blob.type })
      }
      reader.onerror = function() {
        reject(new Error('Unable to convert blob to object!'))
      }
      reader.readAsArrayBuffer(blob)
    })
  }

  function objectToBlob(object) {
    if (object instanceof Blob) {
      return object
    } else if (object.buffer) {
      return new Blob([object.buffer], { type: object.type })
    }
  }

})()

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

