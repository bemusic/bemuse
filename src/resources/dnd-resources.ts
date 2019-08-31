import * as ProgressUtils from 'bemuse/progress/utils'
import readBlob from 'bemuse/utils/read-blob'
import { IResources, IResource } from './types'
import Progress from 'bemuse/progress'

type FileEntry = { name: string; file: File }

export class DndResources implements IResources {
  _files: Promise<FileEntry[]>
  constructor(event: DragEvent) {
    this._files = getFilesFromEvent(event)
  }
  file(name: string) {
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

export class FileResource implements IResource {
  constructor(private _file: File) {}
  read(progress: Progress) {
    return ProgressUtils.atomic(
      progress,
      readBlob(this._file).as('arraybuffer')
    )
  }
  resolveUrl() {
    return Promise.resolve(URL.createObjectURL(this._file))
  }
  get name() {
    return this._file.name
  }
}

export default DndResources

async function getFilesFromEvent(event: DragEvent) {
  let out: FileEntry[] = []
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) {
    throw new Error('Expect event.dataTransfer to be present')
  }
  if (dataTransfer.items) {
    for (let item of Array.from(dataTransfer.items)) {
      await readItem(item)
    }
  } else if (dataTransfer.files) {
    for (let file of Array.from(dataTransfer.files)) {
      addFile(file)
    }
  }
  return out

  async function readItem(item: DataTransferItem) {
    let entry = item.webkitGetAsEntry && item.webkitGetAsEntry()
    if (entry) {
      await readEntry(entry)
    } else {
      let file = item.getAsFile && item.getAsFile()
      if (file) addFile(file)
    }
  }

  function readEntry(entry: any) {
    if (entry.isFile) {
      return readFile(entry)
    } else if (entry.isDirectory) {
      return readDirectory(entry)
    }
  }

  function readFile(entry: any) {
    return new Promise<File>((resolve, reject) => {
      entry.file(resolve, reject)
    }).tap(file => {
      addFile(file)
    })
  }

  async function readDirectory(dir: any) {
    let entries = []
    let reader = dir.createReader()
    let readMore = () =>
      new Promise<any>((resolve, reject) => {
        reader.readEntries(resolve, reject)
      })
    for (;;) {
      let results = await readMore()
      if (!results || results.length === 0) break
      entries.push(...Array.from(results))
    }
    for (let entry of entries) {
      await readEntry(entry)
    }
  }

  function addFile(file: File) {
    if (file) {
      out.push({ name: file.name, file })
    }
  }
}
