
// Webpack entry point.
//
// We need this file to load as soon as possible, therefore,
// we minimize the amount of dependencies.
//

import querystring      from 'querystring'
import Progress         from 'bemuse/progress'

import loadModule       from 'val!./loader.js'

import LoadingContext   from './loading-context'
import * as boot        from './boot'
import * as ErrorDialog from './error-dialog'

let data = querystring.parse(location.search.replace(/^\?/, ''))

/* isparta ignore next */
window.onerror = function(message, url, line, col, e) {
  ErrorDialog.show(message, url, line, col, e)
}

/* isparta ignore next */
let mode = data.mode || 'comingSoon'

/* isparta ignore else - we can check that by functional tests */
if (loadModule[mode]) {
  let progress = new Progress()
  let context = new LoadingContext(progress)
  progress.watch(() => boot.setProgress(progress.progress))
  context.use(function() {
    loadModule[mode](function(loadedModule) {
      boot.hide()
      loadedModule.main()
    })
  })
} else {
  console.error('Invalid mode:', mode)
}

