
// Webpack entry point.
//
// We need this file to load as soon as possible, therefore,
// we minimize the amount of dependencies.
//

import * as boot        from './boot'
import loadModule       from 'val!./loader.js'
import * as querystring from 'querystring'

let data = querystring.parse(location.search.replace(/^\?/, ''))
let mode = data.mode || 'app'

if (loadModule[mode]) {
  loadModule[mode](function() {
    boot.disappear()
  })
} else {
  console.error('Invalid mode:', mode)
}

