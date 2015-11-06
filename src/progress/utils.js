
import { BYTES_FORMATTER } from 'bemuse/progress/formatters'

export function fixed (total, progress) {
  if (!progress) return () => {}
  let loaded = 0
  progress.report(0, total)
  return (extra) => progress.report(++loaded, total, extra)
}

// Reports the progress as an atomic operation.
export function atomic (progress, promise) {
  if (!progress) return promise
  return Promise.resolve(promise)
      .tap((data) => {
        if (data && data.byteLength) {
          progress.formatter = BYTES_FORMATTER
          progress.report(data.byteLength, data.byteLength)
        } else {
          progress.report(1, 1)
        }
      })
}

export function wrapPromise (progress, f) {
  let current = 0
  let total = 0
  return function () {
    progress.report(current, ++total)
    return Promise.resolve(f.apply(this, arguments))
      .tap(() => progress.report(++current, total))
  }
}

export function bind (from, to) {
  return from.watch(() => to.report(from.current, from.total, from.extra))
}

export function simultaneous (target) {
  let queue = [ ]
  let current
  let unsubscribe
  function update () {
    if (current) {
      target.report(current.current, current.total, current.extra)
    }
    if (queue.length > 0 && (!current || current.progress >= 1)) {
      bind(queue.shift())
    }
  }
  function bind (progress) {
    if (current === progress) {
      return
    }
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    current = progress
    if (current) {
      unsubscribe = current.watch(update)
    }
  }
  return {
    add (progress) {
      queue.push(progress)
      update()
    }
  }
}
