
var PENDING = {}

module.exports = function(wrapped) {
  return function() {
    var World = this.World
    var Given = sugar(this, this.Given)
    var When  = sugar(this, this.When)
    var Then  = sugar(this, this.Then)
    wrapped.call(this, World, Given, When, Then)
  }
}

module.exports.PENDING = PENDING

function sugar(environment, defineFunction) {
  return function(pattern, f) {
    defineFunction.call(environment, pattern, function() {
      var callback = arguments[arguments.length - 1]
      var world = this
      Promise.try(f, [].slice.call(arguments), world).then(
        function(result) {
          if (result === PENDING) {
            callback.pending()
          } else {
            callback()
          }
        },
        function(err) {
          callback(err)
        }
      )
    })
  }
}
