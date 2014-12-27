
import Checker          from 'jscs'
import gutil            from 'gulp-util'
import * as configFile  from 'jscs/lib/cli-config'
import ConsoleReporter  from 'jscs/lib/reporters/console'
import through2         from 'through2'

function jscs() {
  let checker = new Checker({ esnext: true })
  checker.getConfiguration().registerDefaultRules()
  checker.configure(configFile.load())
  return through2.obj(function(file, _encoding, callback) {
    void _encoding
    checker.checkFile(file.path)
    .then(function(result) {
      file.jscs = result
      callback(null, file)
    })
    .catch(function(e) {
      callback(e)
    })
  })
}

jscs.report = function() {
  let result = []
  return through2.obj(
    function(chunk, _encoding, callback) {
      void _encoding
      result.push(chunk.jscs)
      callback(null, chunk)
    },
    function(callback) {
      ConsoleReporter(result)
      if (result.some(fileErrors => !fileErrors.isEmpty())) {
        return callback(new gutil.PluginError('jscs', 'Coding style error!'))
      }
    }
  )
}

export default jscs
