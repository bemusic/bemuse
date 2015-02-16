
import bytes from 'bytes'

export function download(url) {
  return {
    as(type, task) {
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
        xh.onprogress = (e) => {
          if (e.total && task) task.update({
            progress: e.loaded / e.total,
            current:  bytes(e.loaded),
            total:    bytes(e.total),
          })
        }
        xh.send(null)
      })
    }
  }
}

export default download
