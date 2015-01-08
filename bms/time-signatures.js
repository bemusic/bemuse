
module.exports = BMSTimeSignatures

function BMSTimeSignatures() {
  this._values = { }
}

BMSTimeSignatures.prototype.set = function(measure, value) {
  this._values[measure] = value
}

BMSTimeSignatures.prototype.get = function(measure) {
  return this._values[measure] || 1
}

BMSTimeSignatures.prototype.getBeats = function(measure) {
  return this.get(measure) * 4
}

BMSTimeSignatures.prototype.measureToBeat = function(measure, fraction) {
  var sum = 0
  for (var i = 0; i < measure; i ++) sum += this.getBeats(i)
  return sum + this.getBeats(measure) * fraction
}

