import * as ProgressUtils from 'bemuse/progress/utils'
import { IResources, FileEntry, LoggingFunction, IResource } from './types'
import ResourceLogging from './resource-logging'
import { unarchive } from './unarchiver'
import readBlob from 'bemuse/utils/read-blob'
import Progress from 'bemuse/progress'
import download from 'bemuse/utils/download'

export const ARCHIVE_REGEXP = /\.(?:zip|rar|7z|tar(?:\.(?:gz|bz2))?)/i

// http://nekokan.dyndns.info/tool/DropboxReplacer/index.html
const DROPBOX_REGEXP = /https?:\/\/(?:(?:www|dl)\.dropbox\.com|dl\.dropboxusercontent\.com)\/(sh?)\/([^?]*)(.*)?$/

export interface CustomResourceProvider {
  getFiles(loggingFunction: LoggingFunction): PromiseLike<FileEntry[]>
}

export class CustomSongResources implements IResources {
  private _logging = new ResourceLogging()
  private _files: PromiseLike<FileEntry[]>
  public setLoggingFunction = this._logging.setLoggingFunction

  constructor(provider: CustomResourceProvider) {
    this._files = Promise.resolve(provider.getFiles(this._logging.log)).then(
      files => unarchiveIfNeeded(files, this._logging.log)
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
    return Promise.resolve(this._files).map(f => f.name)
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

export async function downloadFileEntryFromURL(
  url: string,
  log: LoggingFunction
): Promise<FileEntry> {
  const name = url
    .replace(/[?#].*/, '')
    .split('/')
    .pop()!

  // Try Dropbox URL replacement
  const match = url.match(DROPBOX_REGEXP)
  if (match) {
    url = `https://dl.dropboxusercontent.com/${match[1]}/${match[2]}`
  }

  const progress = new Progress()
  let lastTime = 0
  progress.watch(() => {
    if (Date.now() < lastTime + 5e3) return
    log(`Downloading: ${progress}`)
    lastTime = Date.now()
  })
  const blob = await download(url).as('blob', progress)
  return { name, file: blob }
}
