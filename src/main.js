
import Promise    from 'bluebird'
import program    from 'commander'
import co         from 'co'
import fs         from 'fs'
import { join }   from 'path'

import bmp2png          from './bmp2png'
import AudioConvertor   from './audio'
import Directory        from './directory'
import BemusePacker     from './bemuse-packer'

let mkdirp    = Promise.promisify(require('mkdirp'))
let fileStat  = Promise.promisify(fs.stat, fs)

program
.version(require('../package.json').version)
.usage('[options] <directory> <output.bemuse>')
.parse(process.argv)

if (program.args.length === 1) {
  Promise.resolve(packIntoBemuse(program.args[0]))
  .then(() => console.log('converted successfully'))
  .done()
} else {
  console.error('Error: 1 arguments expected')
  program.outputHelp()
}

function packIntoBemuse(path) {
  return co(function*() {

    let stat = yield fileStat(path)
    if (!stat.isDirectory()) throw new Error('Not a directory: ' + path)

    let directory = new Directory(path)
    let packer    = new BemusePacker(directory)

    console.log('-> Loading audios')
    let audio     = yield directory.files('*.{mp3,wav,ogg}')

    console.log('-> Loading movies')
    let webms     = yield directory.files('*.webm')

    console.log('-> Loading and converting images')
    let imgs      = [].concat(
      yield directory.files('*.{jpg,png}'),
      yield dotMap(directory.files('*.bmp'), bmp2png)
    )

    console.log('-> Converting audio to mp3')
    let mp3c      = new AudioConvertor('mp3')
    let mp3s      = yield dotMap(audio, file => mp3c.convert(file))

    packer.pack('mp3',  mp3s)
    packer.pack('bga',  imgs)
    packer.pack('bgv',  webms)

    console.log('-> Writing...')
    let out = join(path, 'assets')
    yield mkdirp(out)
    yield packer.write(out)

  })
}

function dotMap(array, map) {
  return Promise.map(array, item =>
            Promise.resolve(map(item)).tap(() => process.stdout.write('.')))
    .tap(() => process.stdout.write('\n'))
}
