/**
 * Given the filename, returns the reader options.
 *
 * @public
 */
export function getReaderOptionsFromFilename(filename: string) {
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
