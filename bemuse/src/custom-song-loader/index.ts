import { ICustomSongResources } from 'bemuse/resources/types'
import { Song } from 'bemuse/collection-model/types'

/* eslint import/no-webpack-loader-syntax: off */
export function loadSongFromResources(
  resources: ICustomSongResources,
  options: LoadSongOptions = {}
) {
  const onMessage = options.onMessage || (() => {})
  if (resources.setLoggingFunction) {
    resources.setLoggingFunction(onMessage)
  }
  return resources.fileList
    .then((fileList) => {
      return loadFromFileList(fileList)
    })
    .then((song) => {
      song.resources = resources
      return song
    })

  function loadFromFileList(fileList: string[]) {
    if (fileList.includes('bemuse-song.json')) {
      return loadFromBemuseSongJson()
    } else {
      const bmsFileList = fileList.filter((filename) =>
        /\.(bms|bme|bml|bmson)$/i.test(filename)
      )
      return loadFromBmsFileList(bmsFileList)
    }
  }

  async function loadFromBemuseSongJson() {
    onMessage('"bemuse-song.json" found...')
    const file = await resources.file('bemuse-song.json')
    const data = await file.read()
    const text = await new Blob([data]).text()
    const song = JSON.parse(text) as Song
    return song
  }

  async function loadFromBmsFileList(bmsFileList: string[]) {
    onMessage(bmsFileList.length + ' file(s) found. Reading them...')
    const files = await Promise.all(
      bmsFileList.map(async (filename) => {
        const start = Date.now()
        const file = await resources.file(filename)
        const data = await file.read()
        const elapsed = Date.now() - start
        if (elapsed > 1000) onMessage('Read: ' + filename)
        return {
          name: filename,
          data: data,
        }
      })
    )
    const song = await new Promise<Song>((resolve, reject) => {
      const worker = new Worker(
        new URL('./song-loader.worker.js', import.meta.url)
      )
      worker.onmessage = function ({ data }) {
        if (data.type === 'result') {
          resolve(data.song)
          worker.terminate()
        } else if (data.type === 'started') {
          onMessage('Analyzing BMS files...')
        } else if (data.type === 'progress') {
          onMessage(
            'Loaded ' +
              data.file +
              ' ' +
              '(' +
              data.current +
              '/' +
              data.total +
              ').'
          )
        }
      }
      worker.onerror = function (e) {
        onMessage('Worker error: ' + e)
        console.error('Worker error: ' + e)
        reject(e.error)
      }
      worker.postMessage({ files })
    })
    song.bemusepack_url = null
    return song
  }
}

export interface LoadSongOptions {
  onMessage?: (message: string) => void
}
