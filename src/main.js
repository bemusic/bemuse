
import gulp       from 'gulp'
import gutil      from 'gulp-util'
import program    from 'commander'
import co         from 'co'
import fs         from 'fs'
import promisify  from 'es6-promisify'
import merge      from 'merge-stream'
import map        from 'map-stream'
import endpoint   from 'endpoint'
import Throat     from 'throat'
import { cpus }   from 'os'
import { spawn }  from 'child_process'
import { join }   from 'path'

import BemusePack from './bemuse-pack'

let bail = error => setTimeout(() => { throw error })

program
.version(require('../package.json').version)
.usage('[options] <directory> <output.bemuse>')
.parse(process.argv)

if (program.args.length === 2) {
  packIntoBemuse(program.args[0], program.args[1].replace(/\.bemuse$/i, ''))
  .then(() => gutil.log('converted successfully'), bail)
} else {
  console.error('Error: 2 arguments expected')
  program.outputHelp()
}

function packIntoBemuse(dir, out) {
  return co(function*() {

    let stat = yield promisify(fs.stat)(dir)
    if (!stat.isDirectory()) throw new Error('Not a directory: ' + dir)

    let path = (...components) => join(dir, ...components)
    let src = (pattern, options={ }) =>
                gulp.src(path(pattern),
                  Object.assign({ nocase: true, base: dir }, options))

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
      .pipe(bemusePack(out))

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

function convertAudio() {
  let throat = new Throat(cpus().length || 1)
  return map(function(file, callback) {
    let path = file.path
    let oldName = file.relative
    file.path = file.path.replace(/\.\w+$/, '.mp3')
    let log = gutil.log.bind(gutil, '[convertAudio]',
                oldName, '->', file.relative)
    throat(() => new Promise(function(resolve, reject) {
      let sox = spawn('sox', [path, '-t', 'mp3', '-'])
      sox.stdin.end()
      sox.stderr.on('data', x => process.stderr.write(x))
      sox.stdout.pipe(endpoint(function(err, buffer) {
        if (err) {
          log('ERROR!')
          return reject(err)
        }
        log('OK')
        file.contents = buffer
        resolve(file)
      }))
    }))
    .then(
      result => callback(null, result),
      error => callback(error)
    )
  })
}

function bemusePack(out) {
  let result = new BemusePack(out)
  return map(function(file, callback) {
    result.add(file)
    callback()
  })
  .on('end', function() {
    result.write().catch(bail)
  })
}
