
export function fixed(total, progress) {
  if (!progress) return () => {}
  let loaded = 0
  progress.report(0, total)
  return (extra) => progress.report(++loaded, total, extra)
}

export function wrapPromise(progress, f) {
  let current = 0
  let total = 0
  return function() {
    progress.report(current, ++total)
    return Promise.resolve(f.apply(this, arguments))
      .tap(() => progress.report(++current, total))
  }
}

export function bind(from, to) {
  return from.watch(() => to.report(from.current, from.total, from.extra))
}
