/* eslint import/no-webpack-loader-syntax: off */

// :doc:
//
// Bemuse's **main** entry point.
// We need this file to load as soon as possible, therefore,
// we minimize the amount of third-party dependencies.

import 'bemuse/ui/fonts.scss'
import 'bemuse/ui/global.scss'

import query from 'bemuse/utils/query'

import * as Boot from './ui/Boot'
import * as ErrorDialog from './ui/ErrorDialog'
import loadModule from './loader'

window.onerror = function (message, url, line, col, e) {
  ErrorDialog.show(message, e, url, line, col)
}

// >>
// The Booting Process
// -------------------
// After the ``boot`` script has been loaded, the main script is scanned
// from the ``mode`` query parameter.

const mode = query.mode || 'app'

import(/* webpackChunkName: 'environment' */ './environment')
  .then((_) => {
    if (loadModule[mode]) {
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
      Boot.setStatus(`Loading ${mode} bundle`)
      loadModule[mode]()
        .then((loadedModule) => {
          Boot.setStatus(`Initializing`)
          return loadedModule.main({ setStatus: Boot.setStatus })
        })
        .then(() => Boot.hide())
        .catch((err) => {
          ErrorDialog.show(
            `An error occurred while initializing "${mode}"`,
            err
          )
        })
    } else {
      ErrorDialog.show(`Invalid mode: ${mode}`)
    }
  })
  .catch((err) => {
    ErrorDialog.show(
      'Failed to load environment bundle. Please refresh the page to try again. ' +
        'If that does not work, try holding down the Shift key while clicking Refresh. ' +
        'If that still does not work, please report this issue to the developers at ' +
        'https://github.com/bemusic/bemuse/issues',
      err
    )
    console.error('An error occurred while loading the component', err)
  })
