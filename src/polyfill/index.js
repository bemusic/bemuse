
import '6to5/polyfill'
import debug    from 'debug'
import Bluebird from 'bluebird'

global.DEBUG = debug
global.Promise = Bluebird
