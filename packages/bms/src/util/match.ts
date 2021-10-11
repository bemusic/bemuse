export function match(text: string) {
  var matched = false
  return {
    when: function (
      pattern: RegExp,
      callback: (match: RegExpMatchArray) => void
    ) {
      if (matched) return this
      var match = text.match(pattern)
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
