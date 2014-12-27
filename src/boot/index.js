
// Webpack entry point.
//
// We need this file to load as soon as possible, therefore,
// we minimize the amount of dependencies.
//

import * as boot from './boot'

function loaded(module) {
  boot.disappear()
  void module
}

if (location.search.indexOf('mode=test') > -1) {
  require.ensure(['../test'], require => loaded(require('../test')))
} else {
  require.ensure(['../app'], require => loaded(require('../app')))
}

