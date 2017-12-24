export default readBlob

// Reads the blob as a specified type. The blob will not actually be read
// unless the ``as()`` method is called.
//
// .. js:function:: as(type)
//
//    Starts reading the blob as ``type``. The ``type`` is a String such as
//    "arraybuffer" or "text".
export function readBlob (blob) {
  return {
    as (type) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = function () {
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
