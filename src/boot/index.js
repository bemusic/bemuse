
// :doc:
//
// Bemuse's **main** entry point.
// We need this file to load as soon as possible, therefore,
// we minimize the amount of third-party dependencies.

import 'style?-singleton!bemuse/ui/fonts.scss'
import 'bemuse/ui/global.scss'

import Progress         from 'bemuse/progress'
import query            from 'bemuse/utils/query'

import LoadingContext   from './loading-context'
import * as Boot        from './ui/Boot'
import * as ErrorDialog from './ui/ErrorDialog'

window.onerror = function (message, url, line, col, e) {
  ErrorDialog.show(message, url, line, col, e)
}

// >>
// The Booting Process
// -------------------
// After the ``boot`` script has been loaded, the main script is scanned
// from the ``mode`` query parameter.


let mode = query.mode || 'app'

require.ensure(['./environment'],
function (require) {

  require('./environment')
  var loadModule = require('val!./loader.js')

  if (loadModule[mode]) {
    let progress = new Progress()
    let context = new LoadingContext(progress)
    progress.watch(() => Boot.setProgress(progress.progress))
    context.use(function () {
      // >>
      // The main script is then loaded and imported into the environment,
      // and its ``main()`` method is invoked.
      //
      // Available Modes
      // ~~~~~~~~~~~~~~~
      // The available modes are specified in :src:`boot/loader.js`.
      //
      // .. codedoc:: boot/modes
      //
      loadModule[mode](function (loadedModule) {
        Boot.hide()
        loadedModule.main()
      })
    })
  } else {
    console.error('Invalid mode:', mode)
  }

}, 'environment')
