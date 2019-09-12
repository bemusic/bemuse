import * as ProgressUtils from 'bemuse/progress/utils'
import readBlob from 'bemuse/utils/read-blob'
import { IResources, IResource, FileEntry, LoggingFunction } from './types'
import Progress from 'bemuse/progress'
import { unarchive } from './unarchiver'
import ResourceLogging from './resource-logging'
import download from 'bemuse/utils/download'

const ARCHIVE_REGEXP = /\.(?:zip|rar|7z|tar(?:\.(?:gz|bz2))?)/i

// http://nekokan.dyndns.info/tool/DropboxReplacer/index.html
const DROPBOX_REGEXP = /https?:\/\/(?:(?:www|dl)\.dropbox\.com|dl\.dropboxusercontent\.com)\/(sh?)\/([^?]*)(.*)?$/

export class DndResources implements IResources {
  _logging = new ResourceLogging()
  _files: Promise<FileEntry[]>

  public setLoggingFunction = this._logging.setLoggingFunction

  constructor(event: DragEvent) {
    this._files = getFilesFromEvent(event, this._logging.log).then(files =>
      unarchiveIfNeeded(files, this._logging.log)
    )
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

async function getFilesFromEvent(event: DragEvent, log: LoggingFunction) {
  let out: FileEntry[] = []
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) {
    throw new Error('Expect event.dataTransfer to be present')
  }
  if (dataTransfer.types.indexOf('text/uri-list') > -1) {
    let url = dataTransfer
      .getData('text/uri-list')
      .split(/\r\n|\r|\n/)
      .filter(t => t && !t.startsWith('#'))[0]
    if (ARCHIVE_REGEXP.test(url && url.replace(/[?#].*/, ''))) {
      const name = url
        .replace(/[?#].*/, '')
        .split('/')
        .pop()
      log('Link to archive file detected. Trying to download')

      {
        // Try Dropbox URL replacement
        const match = url.match(DROPBOX_REGEXP)
        if (match) {
          url = `https://dl.dropboxusercontent.com/${match[1]}/${match[2]}`
        }
      }

      const progress = new Progress()
      let lastTime = 0
      progress.watch(() => {
        if (Date.now() < lastTime + 5e3) return
        log(`Downloading: ${progress}`)
        lastTime = Date.now()
      })
      const blob = await download(url).as('blob', progress)
      blob.name = name
      addFile(blob)
    }
  } else if (dataTransfer.items) {
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

export async function unarchiveIfNeeded(
  files: FileEntry[],
  log: LoggingFunction
): Promise<FileEntry[]> {
  if (files.length !== 1) return files
  const fileEntry = files[0]
  if (!fileEntry.name.match(ARCHIVE_REGEXP)) {
    return files
  }
  log('Archive file detected! Now unarchiving…')
  return unarchive(fileEntry.file)
}
