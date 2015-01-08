
module.exports = BMSChart

function BMSChart() {
  this.headers = new BMSHeaders()
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
