export function match(text: string) {
  let matched = false
  return {
    when: function (
      pattern: RegExp,
      callback: (match: RegExpMatchArray) => void
    ) {
      if (matched) return this
      const match = text.match(pattern)
      if (match) {
        matched = true
        callback(match)
      }
      return this
    },
    else: function (callback: () => void) {
      if (matched) return this
      callback()
    },
  }
}
