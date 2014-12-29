
import gutil      from 'gulp-util'
import Throat     from 'throat'
import { cpus }   from 'os'
import { spawn }  from 'child_process'
import endpoint   from 'endpoint'
import map        from 'map-stream'

export function convertAudio() {
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

