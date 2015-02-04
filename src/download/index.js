
export function download(url) {
  return {
    as(type) {
      return new Promise((resolve, reject) => {
        var xh = new XMLHttpRequest()
        xh.open('GET', url, true)
        xh.responseType = type
        xh.onload  = () => resolve(xh.response)
        xh.onerror = () => reject(new Error(`Unable to download ${url}`))
        xh.send(null)
      })
    }
  }
}

export default download
