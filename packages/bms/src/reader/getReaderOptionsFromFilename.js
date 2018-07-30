/**
 * Given the filename, returns the reader options.
 * @param {string} filename
 */
export function getReaderOptionsFromFilename (filename) {
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
