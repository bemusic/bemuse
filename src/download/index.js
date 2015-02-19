
export function download(url) {
  return {
    as(type, progress) {
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
        if (progress) xh.onprogress = e => progress.report(e.loaded, e.total)
        xh.send(null)
      })
    }
  }
}

export default download
