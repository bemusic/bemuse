
import bytes from 'bytes'

let wrap = f => progress => progress.progress !== null ? f(progress) : ''

export let BYTES_FORMATTER = wrap(progress =>
  bytes(progress.current) + ' / ' + bytes(progress.total))

export let EXTRA_FORMATTER = wrap(progress =>
  progress.extra + '')
