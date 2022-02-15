import { ReaderOptions } from './types'

/**
 * Given the filename, returns the suggested {@link ReaderOptions}.
 * @public
 */
export function getReaderOptionsFromFilename(filename: string): ReaderOptions {
  let forceEncoding
  if (filename.match(/\.sjis\.\w+$/i)) {
    forceEncoding = 'Shift-JIS'
  }
  if (filename.match(/\.euc_kr\.\w+$/i)) {
    forceEncoding = 'EUC-KR'
  }
  if (filename.match(/\.utf8\.\w+$/i)) {
    forceEncoding = 'UTF-8'
  }
  return { forceEncoding }
}
