
// :doc:
// Bootstraps the environment with:
//
// - `babel-polyfill`_
// - `debug`_
// - `Bluebird`_ (with `extended Promise API`_)
//
// .. _ES6 Runtime: https://babeljs.io/docs/usage/polyfill/
// .. _Babel: https://babeljs.io/
// .. _debug: https://www.npmjs.com/package/debug
// .. _bluebird: https://github.com/petkaantonov/bluebird
// .. _Extended Promise API: https://github.com/petkaantonov/bluebird/blob/master/API.md

import 'babel-polyfill'
import debug    from 'debug'
import Bluebird from 'bluebird'

// .. js:data:: DEBUG
//
//    An instance of ``debug``. Used for debugging.
global.DEBUG = debug

// .. js:data:: Promise
//
//    The Global Promise is replaced with Bluebird's implementation.
global.Promise = Bluebird

// .. js:function:: Promise.prototype.log
//
//    The Promise class is augmented with a ``log`` method that simply
//    logs the value of the promise.
Promise.prototype.log = function (...args) { // eslint-disable-line no-extend-native
  return this.tap(value => console.log(...args.concat([value])))
}
