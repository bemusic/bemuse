
// Webpack entry point.
//
// We need this file to load as soon as possible, therefore,
// we minimize the amount of dependencies.
//

import './boot'

if (location.search.indexOf('mode=test') > -1) {
  require.ensure(['../test'], (require) => require('../test'))
} else {
  require.ensure(['../app'], (require) => require('../app'))
}

