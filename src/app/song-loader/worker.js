
import indexer from 'bemuse-indexer'
import Promise from 'bluebird'

addEventListener('message', function({ data }) {
  let files = data.files.map(convertBuffer)
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
