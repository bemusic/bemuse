
import co from 'co'
import readBlob from 'bemuse/read-blob'

export class DndResources {
  constructor(event) {
    this._files = getFilesFromEvent(event)
  }
  file(name) {
    return this._files.then(function(files) {
      for (let file of files) {
        if (file.name.toLowerCase() === name.toLowerCase()) {
          return new FileResource(file.file)
        }
      }
      throw new Error('unable to find ' + name)
    })
  }
  get fileList() {
    return Promise.resolve(this._files.map(f => f.name))
  }
}

export class FileResource {
  constructor(file) {
    this._file = file
  }
  read() {
    return readBlob(this._file).as('arraybuffer')
  }
}

export default DndResources

function getFilesFromEvent(event) {

  let out = []

  return co(function*() {
    for (let item of Array.from(event.dataTransfer.items)) {
      yield readItem(item)
    }
    return out
  })

  function readItem(item) {
    return co(function*() {
      let entry = item.webkitGetAsEntry && item.webkitGetAsEntry()
      if (entry) {
        yield readEntry(entry, '')
      } else {
        let file = item.getAsFile && item.getAsFile()
        if (file) {
          out.push({ name: file.name, file })
        }
      }
    })
  }

  function readEntry(entry) {
    if (entry.isFile) {
      return readFile(entry)
    } else if (entry.isDirectory) {
      return readDirectory(entry)
    }
  }

  function readFile(entry) {
    return new Promise((resolve, reject) => {
      entry.file(resolve, reject)
    })
    .tap((file) => {
      out.push({ name: file.name, file })
    })
  }

  function readDirectory(dir) {
    return co(function*() {
      let entries = []
      let reader = dir.createReader()
      let readMore = () => new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject)
      })
      for (;;) {
        let results = yield readMore()
        if (!results || results.length === 0) break
        entries.push(...Array.from(results))
      }
      for (let entry of entries) {
        yield readEntry(entry)
      }
    })
  }

}
