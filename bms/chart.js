
module.exports = BMSChart

function BMSChart() {
  this.headers = new BMSHeaders()
  this.objects = new BMSObjects()
}

BMSChart.prototype.measureToBeat = function(measure, fraction) {
  return (measure + fraction) * 4
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
  this._objects.push(object)
}

BMSObjects.prototype.all = function() {
  return this._objects
}
