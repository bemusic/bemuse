
module.exports = Stop

function Stop(beat, stopBeats, stopSeconds) {
  this.beat        = beat
  this.stopBeats   = stopBeats
  this.stopSeconds = stopSeconds
  this.order       = 2
}

