import { BYTES_FORMATTER } from 'bemuse/progress/formatters'
import { Progress } from './Progress'

/**
 * Returns a callback that, when called,
 * update the progress with increasing `current` value,
 * out of a fixed `total`.
 */
export function fixed(total: number, progress: Progress) {
  if (!progress) return () => {}
  let loaded = 0
  progress.report(0, total)
  return (extra: any) => progress.report(++loaded, total, extra)
}

/**
 * Updates the progress with the result of an atomic operation.
 */
export function atomic<T>(
  progress: Progress,
  promise: PromiseLike<T>
): PromiseLike<T> {
  if (!progress) return promise
  return Promise.resolve(promise).tap((data) => {
    if (hasByteLength(data)) {
      progress.formatter = BYTES_FORMATTER
      progress.report(data.byteLength, data.byteLength)
    } else {
      progress.report(1, 1)
    }
  })
}
function hasByteLength(data: any): data is { byteLength: number } {
  return data && data.byteLength
}

/**
 * Wraps an async function that may be called multiple times.
 * Each call adds to the total, and each async resolution adds to current.
 */
export function wrapPromise<A extends any[], R>(
  progress: Progress,
  f: (...args: A) => PromiseLike<R>
): (...args: A) => PromiseLike<R> {
  let current = 0
  let total = 0
  return function (this: any, ...args: A) {
    progress.report(current, ++total)
    return Promise.resolve(f.apply(this, args)).tap(() =>
      progress.report(++current, total)
    )
  }
}

export function bind(from: Progress, to: Progress) {
  return from.watch(() => to.report(from.current!, from.total!, from.extra))
}

/**
 * Updates the `target` with progress data from multiple sources.
 */
export function simultaneous(target: Progress) {
  let queue: Progress[] = []
  let current: Progress | undefined
  let unsubscribe: (() => void) | null = null
  function update() {
    if (current) {
      target.report(current.current!, current.total!, current.extra)
    }
    if (queue.length > 0 && (!current || current.progress! >= 1)) {
      bind(queue.shift()!)
    }
  }
  function bind(progress: Progress) {
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
    add(progress: Progress) {
      queue.push(progress)
      update()
    },
  }
}
