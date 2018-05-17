
var _ = require('lodash')

function getDuration(notes, timing) {
  var maxBeat = _(notes.all()).pluck('beat').max()
  return timing.beatToSeconds(maxBeat)
}

module.exports = getDuration
