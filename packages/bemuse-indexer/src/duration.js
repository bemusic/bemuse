import _ from 'lodash'

export function getDuration(notes, timing) {
  var maxBeat = _(notes.all())
    .map('beat')
    .max()
  return timing.beatToSeconds(maxBeat)
}
