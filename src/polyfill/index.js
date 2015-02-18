
import '6to5/polyfill'
import debug    from 'debug'
import Bluebird from 'bluebird'

global.DEBUG = debug
global.Promise = Bluebird

Promise.prototype.log = function(...args) {
  return this.tap(value => console.log(...args.concat([value])))
}
