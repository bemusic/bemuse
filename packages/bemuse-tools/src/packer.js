import fs from 'fs'
import mkdirp from 'mkdirp'
import { join } from 'path'

import AudioConvertor from './audio'
import BemusePacker from './bemuse-packer'
import Directory from './directory'

const fileStat = fs.promises.stat

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

async function dotMap(array, map) {
  const results = await Promise.all(
    array.map(async (item) => {
      try {
        const result = await map(item)
        process.stdout.write('.')
        return [result]
      } catch (e) {
        process.stdout.write('x')
        process.stderr.write('[ERR] ' + e.stack)
        return []
      }
    })
  )
  process.stdout.write('\n')
  return results.flat()
}
