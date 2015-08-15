
import indexer  from 'bemuse-indexer'
import Promise  from 'bluebird'

import * as BMSON from './bmson'

/*global FileReaderSync*/
if (typeof FileReader === 'undefined' &&
    typeof FileReaderSync !== 'undefined') {
  // Need to shim FileReader so that bemuse-chardet works.
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

function getFileInfo(buffer, metadata) {
  if (metadata.name.match(/\.bmson$/i)) {
    return BMSON.getInfo(buffer, metadata)
  } else {
    return indexer.getFileInfo(buffer, metadata)
  }
}

addEventListener('message', function({ data }) {
  let files = data.files.map(convertBuffer)
  postMessage({ type: 'started' })
  function onProgress(current, total, file) {
    postMessage({ type: 'progress', current, total, file })
  }
  Promise.try(function () {
    return indexer.getSongInfo(files, { onProgress, getFileInfo })
  })
  .then(function(song) {
    song.warnings.forEach(function(warning) {
      if (global.console && console.warn) {
        console.warn(warning)
      }
    })
    postMessage({ type: 'result', song: song })
  })
  .catch(function() {
    console.error('CAUGHT')
  })
  .done()
})

function convertBuffer(file) {
  file.data = new Buffer(new Uint8Array(file.data))
  return file
}
