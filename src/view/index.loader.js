
module.exports = function() {
}

module.exports.pitch = function(remaining) {
  var templateModule  = '!!ractive!bemuse/view/template!' + remaining
  return 'var View = require("bemuse/view").View; ' +
      'var template = require(' + JSON.stringify(templateModule) + '); ' +
      'module.exports = new View(template);'
}
