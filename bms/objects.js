
module.exports = BMSObjects

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

