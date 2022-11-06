/* global FileReader, Blob */
import { ReaderOptions } from './types'
import chardet = require('bemuse-chardet/bemuse-chardet')

export function read(buffer: Buffer) {
  throw new Error('Synchronous read unsupported in browser!')
}

export function readAsync(
  buffer: Buffer,
  options: ReaderOptions | null
): Promise<string>
export function readAsync(buffer: Buffer): Promise<string>
export function readAsync(...args: any[]) {
  const buffer: Buffer = args[0]
  const options: ReaderOptions | null = args[1]
  const charset = (options && options.forceEncoding) || chardet.detect(buffer)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
      resolve(reader.result as string)
    }
    reader.onerror = function () {
      reject(new Error('cannot read it'))
    }
    reader.readAsText(new Blob([buffer]), charset)
  })
}

export { getReaderOptionsFromFilename } from './getReaderOptionsFromFilename'
