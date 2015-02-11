
export class LoadingContext {
  load(script, head) {
    let src = script.src
    let xh = new XMLHttpRequest()
    xh.open('GET', src, true)
    xh.responseType = 'blob'
    xh.onprogress = (e) => {
      if (e.total && e.lengthComputable) {
        this.onprogress(e.loaded, e.total)
      }
    }
    xh.onload = () => {
      let parts = [xh.response, '\n//# sourceURL=' + src]
      let type = 'text/javascript'
      let url = URL.createObjectURL(new Blob(parts, { type }))
      script.src = url
      head.appendChild(script)
    }
    xh.send(null)
  }
  onprogress() {
  }
  use(callback) {
    let old = window.WebpackLoadingContext
    try {
      window.WebpackLoadingContext = this
      callback()
    } finally {
      window.WebpackLoadingContext = old
    }
  }
}

export default LoadingContext


