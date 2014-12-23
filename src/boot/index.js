
// Webpack entry point.
//
// We need this file to load as soon as possible, therefore,
// we minimize the amount of dependencies.
//

import * as boot from './boot'

function load(loader) {
  loader(function(mdl) {
    boot.disappear()
  })
}

if (location.search.indexOf('mode=test') > -1) {
  load(require('bundle?lazy!../test'))
} else {
  load(require('bundle?lazy!../app'))
}

