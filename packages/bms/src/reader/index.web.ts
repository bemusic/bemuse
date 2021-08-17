/* global FileReader, Blob */
import { ReaderOptions, ReadCallback } from './types'
import chardet from 'bemuse-chardet/bemuse-chardet'

export function read(buffer: Buffer) {
  throw new Error('Synchronous read unsupported in browser!')
}

export function readAsync(
  buffer: Buffer,
  options: ReaderOptions | null,
  callback?: ReadCallback
): void
export function readAsync(buffer: Buffer, callback?: ReadCallback): void
export function readAsync(...args: any[]) {
  let buffer: Buffer = args[0]
  let options: ReaderOptions | null = args[1]
  let callback: ReadCallback = args[2]
  if (callback) {
    options = args[1]
    callback = args[2]
  } else {
    options = null
    callback = args[1]
  }
  var charset = (options && options.forceEncoding) || chardet.detect(buffer)
  var reader = new FileReader()
  reader.onload = function() {
    callback(null, reader.result as string)
  }
  reader.onerror = function() {
    callback(new Error('cannot read it'))
  }
  reader.readAsText(new Blob([buffer]), charset)
}

export { getReaderOptionsFromFilename } from './getReaderOptionsFromFilename'
