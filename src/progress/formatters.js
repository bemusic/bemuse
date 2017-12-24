import bytes from 'bytes'

let wrap = f => progress => (progress.progress !== null ? f(progress) : '')

// Formats the `Progress` as bytes (e.g. 1.23mb of 1.31mb).
export let BYTES_FORMATTER = wrap(
  progress => bytes(progress.current) + ' / ' + bytes(progress.total)
)

// Formats the `Progress` as percentage.
export let PERCENTAGE_FORMATTER = wrap(
  progress => (progress.current / progress.total * 100).toFixed(1) + '%'
)

// Formats the `Progress` simply by using the value of `Progress#extra`.
export let EXTRA_FORMATTER = wrap(progress => progress.extra + '')
