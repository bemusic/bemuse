
import 'prfun'
import gulp       from 'gulp'
import gutil      from 'gulp-util'
import program    from 'commander'
import co         from 'co'
import fs         from 'fs'
import merge      from 'merge-stream'
import map        from 'map-stream'
import through2   from 'through2'
import { join }   from 'path'

import { convertAudio } from './audio'
import BemusePacker     from './bemuse-packer'

program
.version(require('../package.json').version)
.usage('[options] <directory> <output.bemuse>')
.parse(process.argv)

if (program.args.length === 2) {
  packIntoBemuse(program.args[0], program.args[1].replace(/\.bemuse$/i, ''))
  .then(() => gutil.log('converted successfully'))
  .done()
} else {
  console.error('Error: 2 arguments expected')
  program.outputHelp()
}

function packIntoBemuse(dir, out) {
  return co(function*() {

    let stat = yield Promise.promisify(fs.stat)(dir)
    if (!stat.isDirectory()) throw new Error('Not a directory: ' + dir)

    let path = (...components) => join(dir, ...components)
    let src = (pattern, options) =>
                gulp.src(path(pattern),
                  Object.assign({ nocase: true, base: dir }, options || { }))

    let files = merge(
      src('*.{bms,bme,bml,pms}')
        .pipe(tagType('bms')),
      src('*.mp3')
        .pipe(tagType('snd')),
      src('*.{wav,ogg}', { read: false })
        .pipe(convertAudio())
        .pipe(tagType('snd'))
    )

    let stream = merge(files)
      .pipe(bemusePacker(out))

    yield waitStream(stream)
    
  })
}

function tagType(type) {
  return map(function(file, cb) {
    file.assetType = type
    cb(null, file)
  })
}

function waitStream(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve)
    stream.on('error', reject)
  })
}

function bemusePacker(out) {
  let result = new BemusePacker(out)
  return through2.obj(
    function(file, _encoding, callback) {
      void _encoding
      result.add(file)
      callback()
    },
    function(callback) {
      result.write().nodify(callback)
    }
  )
}
