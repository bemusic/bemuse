
var lazy = require('lazy-property')

module.exports = function() {

  if (this.World.plugins) return

  function World(callback) {
    this.prop = lazy.bind(null, this)
    World.plugins.forEach(function(plugin) {
      plugin.call(this)
    }.bind(this))
    callback()
  }

  this.World = World

  this.World.plugins = []

  this.World.plug = function(plugin) {
    this.plugins.push(plugin)
  }

}
