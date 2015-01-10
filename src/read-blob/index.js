
export default readBlob

export function readBlob(blob) {
  return {
    as: function(type) {
      return new Promise(function(resolve, reject) {
        let reader = new FileReader()
        reader.onload = function() {
          resolve(reader.result)
        }
        reader.onerror = function() {
          reject(new Error('Unable to read from Blob'))
        }
        switch (type) {
        case 'arraybuffer':
          reader.readAsArrayBuffer(blob)
          break
        case 'text':
          reader.readAsText(blob)
          break
        }
      })
    }
  }
}
