
var _ = require('lodash')

function Keysounds(map) {
  this._map = map
}

Keysounds.prototype.get = function(id) {
  return this._map[id.toLowerCase()]
}

Keysounds.prototype.files = function() {
  return _.uniq(_.values(this._map))
}

Keysounds.prototype.all = function() {
  return this._map
}

Keysounds.fromBMSChart = function(chart) {
  var map = {}
  chart.headers.each(function(name, value) {
    var match = name.match(/^wav(\S\S)$/i)
    if (!match) return
    map[match[1].toLowerCase()] = value
  })
  return new Keysounds(map)
}

module.exports = Keysounds
