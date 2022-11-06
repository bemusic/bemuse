// Public: A module that takes a buffer, detects the character set, and
// returns the decoded string.
//
// The Reader follows [ruv-it!’s algorithm](http://hitkey.nekokan.dyndns.info/cmds.htm#CHARSET)
// for detecting the character set.
//
import { ReaderOptions } from './types'
import chardet = require('bemuse-chardet/bemuse-chardet')
import iconv = require('iconv-lite')

/**
 * Reads the buffer, detect the character set, and returns the decoded
 * string synchronously.
 * @returns the decoded text
 */
export function read(
  buffer: Buffer,
  options: ReaderOptions | null = null
): string {
  const charset = (options && options.forceEncoding) || chardet.detect(buffer)
  const text = iconv.decode(buffer, charset)
  if (text.charCodeAt(0) === 0xfeff) {
    // BOM?!
    return text.substr(1)
  } else {
    return text
  }
}

/**
 * Like `read(buffer)`, but this is the asynchronous version.
 */
export function readAsync(
  buffer: Buffer,
  options: ReaderOptions | null
): Promise<string>
/**
 * Like `read(buffer)`, but this is the asynchronous version.
 */
export function readAsync(buffer: Buffer): Promise<string>

export function readAsync(...args: any[]) {
  const buffer: Buffer = args[0]
  const options: ReaderOptions | null = args[1]
  return new Promise(function (resolve, reject) {
    try {
      resolve(read(buffer, options))
    } catch (e) {
      reject(e)
    }
  })
}

export { getReaderOptionsFromFilename } from './getReaderOptionsFromFilename'
