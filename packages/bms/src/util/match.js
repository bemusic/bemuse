
module.exports = match

function match (text) {
  var matched = false
  return {
    when: function (pattern, callback) {
      if (matched) return this
      var match = text.match(pattern)
      if (match) {
        matched = true
        callback(match)
      }
      return this
    },
    else: function (callback) {
      if (matched) return this
      callback()
    }
  }
}

