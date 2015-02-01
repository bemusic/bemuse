
// Webpack entry point.
//
// We need this file to load as soon as possible, therefore,
// we minimize the amount of dependencies.
//

import querystring      from 'querystring'

import loadModule       from 'val!./loader.js'

import * as boot        from './boot'
import * as ErrorDialog from './error-dialog'

let data = querystring.parse(location.search.replace(/^\?/, ''))

/* istanbul ignore next */
window.onerror = function(message, url, line, col, e) {
  ErrorDialog.show(message, url, line, col, e)
}

/* istanbul ignore next */
let mode = data.mode || 'comingSoon'

/* istanbul ignore else - we can check that by functional tests */
if (loadModule[mode]) {
  loadModule[mode](function(loadedModule) {
    boot.hide()
    loadedModule.main()
  })
} else {
  console.error('Invalid mode:', mode)
}

