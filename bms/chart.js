
module.exports = BMSChart

function BMSChart() {
  this.headers = new BMSHeaders()
  this.objects = new BMSObjects()
  this.timeSignatures = new BMSTimeSignatures()
}

BMSChart.prototype.measureToBeat = function(measure, fraction) {
  return this.timeSignatures.measureToBeat(measure, fraction)
}


function BMSHeaders() {
  this._data = { }
}

BMSHeaders.prototype.get = function(name) {
  return this._data[name.toLowerCase()]
}

BMSHeaders.prototype.set = function(name, value) {
  this._data[name.toLowerCase()] = value
}


function BMSObjects() {
  this._objects = []
}

BMSObjects.prototype.add = function(object) {
  if (object.channel !== '01') {
    for (var i = 0; i < this._objects.length; i ++) {
      var test = this._objects[i]
      if (test.channel === object.channel &&
          test.measure === object.measure &&
          test.fraction === object.fraction) {
        this._objects[i] = object
        return
      }
    }
  }
  this._objects.push(object)
}

BMSObjects.prototype.all = function() {
  return this._objects
}


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
