import { Song } from 'bemuse/collection-model/types'
import { ICustomSongResources } from 'bemuse/resources/types'
import Worker from './song-loader.worker'

/* eslint import/no-webpack-loader-syntax: off */
export function loadSongFromResources(
  resources: ICustomSongResources,
  options: LoadSongOptions = {}
) {
  var onMessage = options.onMessage || (() => {})
  console.log(resources)
  if (resources.setLoggingFunction) {
    resources.setLoggingFunction(onMessage)
  }
  return resources.fileList
    .then(fileList => {
      console.log(fileList)
      return fileList.filter(filename =>
        /\.(bms|bme|bml|bmson)$/i.test(filename)
      )
    })
    .then(bmsFileList => {
      onMessage(bmsFileList.length + ' file(s) found. Reading them...')
      return Promise.map(bmsFileList, filename => {
        const start = Date.now()
        return resources
          .file(filename)
          .then(file => file.read())
          .then(x => {
            const elapsed = Date.now() - start
            if (elapsed > 1000) onMessage('Read: ' + filename)
            return x
          })
          .then(arrayBuffer => ({
            name: filename,
            data: arrayBuffer,
          }))
      })
    })
    .then(files => {
      return new Promise<Song>((resolve, reject) => {
        let worker = new Worker()
        worker.onmessage = function({ data }) {
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
        worker.onerror = function(e) {
          onMessage('Worker error: ' + e)
          console.error('Worker error: ' + e)
          reject(e.error)
        }
        worker.postMessage({ files })
      })
    })
    .then(song => {
      song.resources = resources
      return song
    })
}

export interface LoadSongOptions {
  onMessage?: (message: string) => void
}
