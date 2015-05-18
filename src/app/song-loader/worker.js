
import indexer from 'bemuse-indexer'
import Promise from 'bluebird'

if (typeof FileReader === 'undefined' &&
    typeof FileReaderSync !== 'undefined') {
  global.FileReader = function FileReaderShim() {
    let reader = new FileReaderSync()
    return {
      readAsText(blob, enc) {
        try {
          this.result = reader.readAsText(blob, enc)
          this.onload()
        } catch (e) {
          this.onerror(e)
        }
      }
    }
  }
}

addEventListener('message', function({ data }) {
  let files = data.files.map(convertBuffer)
  postMessage({ type: 'started' })
  function onProgress(current, total, file) {
    postMessage({ type: 'progress', current, total, file })
  }
  Promise.resolve(indexer.getSongInfo(files, { onProgress }))
  .then(function(result) {
    postMessage({ type: 'result', song: result })
  })
  .done()
})

function convertBuffer(file) {
  file.data = new Buffer(new Uint8Array(file.data))
  return file
}
