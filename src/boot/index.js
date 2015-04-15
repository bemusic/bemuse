
// :doc:
//
// Bemuse's **main** entry point.
// We need this file to load as soon as possible, therefore,
// we minimize the amount of third-party dependencies.

import 'style?-singleton!bemuse/view/fonts.scss'
import 'bemuse/view/global.scss'

import Progress         from 'bemuse/progress'
import query            from 'bemuse/query'

import LoadingContext   from './loading-context'
import * as boot        from './boot'
import * as ErrorDialog from './error-dialog'

/* isparta ignore next */
window.onerror = function(message, url, line, col, e) {
  ErrorDialog.show(message, url, line, col, e)
}

// >>
// The Booting Process
// -------------------
// After the ``boot`` script has been loaded, the main script is scanned
// from the ``mode`` query parameter.


/* isparta ignore next */
let mode = query.mode || 'comingSoon'

require.ensure(['jquery', 'bemuse/polyfill', 'val!./loader.js'],
function(require) {

  var loadModule = require('val!./loader.js')

  require('bemuse/polyfill')

  /* isparta ignore else - we can check that by functional tests */
  if (loadModule[mode]) {
    let progress = new Progress()
    let context = new LoadingContext(progress)
    progress.watch(() => boot.setProgress(progress.progress))
    context.use(function() {
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
      loadModule[mode](function(loadedModule) {
        boot.hide()
        loadedModule.main()
      })
    })
  } else {
    console.error('Invalid mode:', mode)
  }

}, 'environment')

