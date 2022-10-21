import Promise from 'bluebird'
import fs from 'fs'
import _ from 'lodash'

import { join } from 'path'

import AudioConvertor from './audio'
import Directory from './directory'
import BemusePacker from './bemuse-packer'

const mkdirp = Promise.promisify(require('mkdirp'))
const fileStat = Promise.promisify(fs.stat, fs)

export async function packIntoBemuse(path) {
  const stat = await fileStat(path)
  if (!stat.isDirectory()) throw new Error('Not a directory: ' + path)

  const directory = new Directory(path)
  const packer = new BemusePacker(directory)

  console.log('-> Loading audios')
  const audio = await directory.files('*.{mp3,wav,ogg}')

  console.log('-> Converting audio to ogg [better audio performance]')
  const oggc = new AudioConvertor('ogg', '-C', '3')
  oggc.force = true
  const oggs = await dotMap(audio, (file) => oggc.convert(file))
  packer.pack('ogg', oggs)

  console.log('-> Writing...')
  const out = join(path, 'assets')
  await mkdirp(out)
  await packer.write(out)
}

function dotMap(array, map) {
  return Promise.map(array, (item) =>
    Promise.resolve(map(item))
      .tap(() => process.stdout.write('.'))
      .then((result) => [result])
      .catch((e) => {
        process.stdout.write('x')
        process.stderr.write('[ERR] ' + e.stack)
        return []
      })
  )
    .then((results) => _.flatten(results))
    .tap(() => process.stdout.write('\n'))
}
