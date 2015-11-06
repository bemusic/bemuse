
import { BYTES_FORMATTER } from 'bemuse/progress/formatters'

// Downloads the file from the URL.
// The download will not actually be started unless the ``as()`` method
// is called.
//
// .. js:function:: as(type)
//
//    Initiates the download as ``type``. The ``type`` is a string such as
//    "arraybuffer" or "blob".
export function download (url) {
  return {
    as (type, progress) {
      return new Promise((resolve, reject) => {
        var xh = new XMLHttpRequest()
        xh.open('GET', url, true)
        xh.responseType = type
        xh.onload  = () => {
          if (+xh.status === 200) {
            resolve(xh.response)
          } else {
            reject(new Error(`Unable to download ${url}: HTTP ${xh.status}`))
          }
        }
        xh.onerror = () => reject(new Error(`Unable to download ${url}`))
        if (progress) {
          progress.formatter = BYTES_FORMATTER
          xh.onprogress = e => progress.report(e.loaded, e.total)
        }
        xh.send(null)
      })
    }
  }
}

export default download
