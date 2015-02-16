
// This file holds a logic to generate a code-splitting loader function.
// The code is compiled on build-time.

var modules = {
      app:        'bemuse/app',
      test:       'bemuse/test',
      comingSoon: 'bemuse/coming-soon',
      sync:       'bemuse/auto-synchro',
      game:       'bemuse/game',
    }

var code = 'module.exports = {'

code += Object.keys(modules).map(function(key) {
  var path = modules[key]
  return JSON.stringify(key) + ': function(callback) {' +
    'require.ensure(' + JSON.stringify([path]) + ', function(require) {' +
      'callback(require(' + JSON.stringify(path) + '))' +
    '}, ' + JSON.stringify(key + 'Mode') + ')' +
  '}'
}).join(',\n')

code += '}'

module.exports = code

