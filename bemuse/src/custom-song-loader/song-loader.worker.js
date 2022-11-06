import 'bemuse/bootstrap'

import * as indexer from 'bemuse-indexer'

/* global FileReaderSync */
if (
  typeof FileReader === 'undefined' &&
  typeof FileReaderSync !== 'undefined'
) {
  // Need to shim FileReader so that bemuse-chardet works.
  global.FileReader = function FileReaderShim() {
    const reader = new FileReaderSync()
    return {
      readAsText(blob, enc) {
        try {
          this.result = reader.readAsText(blob, enc)
          this.onload()
        } catch (e) {
          this.onerror(e)
        }
      },
    }
  }
}

addEventListener('message', function ({ data }) {
  const files = data.files.map(convertBuffer)
  postMessage({ type: 'started' })
  function onProgress(current, total, file) {
    postMessage({ type: 'progress', current, total, file })
  }
  indexer
    .getSongInfo(files, { onProgress })
    .then(function (song) {
      song.warnings.forEach(function (warning) {
        if (global.console && console.warn) {
          console.warn(warning)
        }
      })
      postMessage({ type: 'result', song: song })
    })
    .catch(function (e) {
      console.error('CAUGHT', e)
    })
})

function convertBuffer(file) {
  file.data = Buffer.from(new Uint8Array(file.data))
  return file
}
