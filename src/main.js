
import gulp       from 'gulp'
import gutil      from 'gulp-util'
import program    from 'commander'
import co         from 'co'
import fs         from 'fs'
import promisify  from 'es6-promisify'

program
.version(require('../package.json').version)
.usage('[options] <directory>')
.parse(process.argv)

if (program.args.length === 1) {
  packIntoBemuse(program.args[0])
  .then(
    () => gutil.log('converted successfully'),
    e  => setImmediate(() => { throw e })
  )
} else {
  console.error('Error! Expected 1 argument - BMS directory')
  program.outputHelp()
}

function packIntoBemuse(dir) {
  return co(function*() {
    let stat = yield promisify(fs.stat)(dir)
    if (!stat.isDirectory()) {
      throw new Error('Not a directory: ' + dir)
    }
    console.log(stat)
  })
}

