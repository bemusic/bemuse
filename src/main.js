
import gulp       from 'gulp'
import gutil      from 'gulp-util'
import program    from 'commander'
import co         from 'co'
import fs         from 'fs'
import promisify  from 'es6-promisify'
import merge      from 'merge-stream'
import map        from 'map-stream'
import endpoint   from 'endpoint'

import { join, basename } from 'path'
import { spawn } from 'child_process'

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
    if (!stat.isDirectory()) throw new Error('Not a directory: ' + dir)

    let path = (...components) => join(dir, ...components)

    let samples = merge(
      
      // MP3
      gulp.src(path('*.mp3'), { stream: true, nocase: true }),

      // WAV, OGG
      gulp.src(path('*.{wav,ogg}'), { read: false, nocase: true })
          .pipe(convertAudio())

    )

    let stream = merge(samples)
    yield waitStream(stream)

  })
}

function waitStream(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve)
    stream.on('error', reject)
  })
}

function convertAudio(stream) {
  return map(function(file, callback) {
    let path = file.path
    file.path = file.path.replace(/\.\w+$/, '.mp3')
    let log = gutil.log.bind(gutil, '[convertAudio]',
                basename(path), '->', basename(file.path))
    let sox = spawn('sox', [path, '-t', 'mp3', '-'])
    sox.stdin.end()
    sox.stderr.on('data', x => process.stderr.write(x))
    sox.stdout.pipe(endpoint(function(err, buffer) {
      if (err) {
        log('ERROR!')
        return callback(err)
      }
      log('[' + Math.round(buffer.length / 1024) + 'kB]')
      callback(null, file)
    }))
  })
}

