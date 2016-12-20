
// This file holds the logic to generate a code-splitting loader function.
// The code is compiled on build-time.
var modules = {

  // >> boot/modes
  // app
  //   The main game application. This will bring up the Title Screen.
  app:        'bemuse/app',

  // >>
  // music
  //   The music collection viewer which shows all the songs.
  music:      'bemuse/music-collection-viewer',

  // >>
  // test
  //   The unit tests.
  test:       'bemuse/test',

  // >>
  // comingSoon
  //   Displays the "coming soon" text.
  comingSoon: 'bemuse/coming-soon',

  // >>
  // sync
  //   Displays a simple UI for determining your computer's audio+input
  //   latency.
  sync:       'bemuse/auto-synchro',

  // >>
  // game
  //   Runs the game shell.
  game:       'bemuse/game',

  // >>
  // playground
  //   Various playgrounds...
  playground: 'bemuse/devtools/playground',

}

var code = 'module.exports = {'

code += Object.keys(modules).map(function (key) {
  var path = modules[key]
  return JSON.stringify(key) + ': function(callback) {' +
    'require.ensure(' + JSON.stringify([path]) + ', function(require) {' +
      'callback(require(' + JSON.stringify(path) + '))' +
    '}, ' + JSON.stringify(key + 'Mode') + ')' +
  '}'
}).join(',\n')

code += '}'

module.exports = code
