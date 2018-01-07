/* eslint import/no-webpack-loader-syntax: off */

// :doc:
//
// Bemuse's **main** entry point.
// We need this file to load as soon as possible, therefore,
// we minimize the amount of third-party dependencies.

import 'style-loader?-singleton!bemuse/ui/fonts.scss'
import 'bemuse/ui/global.scss'

import Progress from 'bemuse/progress'
import query from 'bemuse/utils/query'

import * as Boot from './ui/Boot'
import * as ErrorDialog from './ui/ErrorDialog'
import loadModule from './loader'
import LoadingContext from './loading-context'

window.onerror = function (message, url, line, col, e) {
  ErrorDialog.show(message, url, line, col, e)
}

// >>
// The Booting Process
// -------------------
// After the ``boot`` script has been loaded, the main script is scanned
// from the ``mode`` query parameter.

let mode = query.mode || 'app'

import(/* webpackChunkName: 'environment' */ './environment')
  .then(_ => {
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
        loadModule[mode]().then(loadedModule => {
          Boot.hide()
          loadedModule.main()
        }).catch(err => console.error('An error occurred while loading the mode', err))
      })
    } else {
      console.error('Invalid mode:', mode)
    }
  }).catch(err => console.error('An error occurred while loading the component', err))
