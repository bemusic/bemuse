import Throat from 'throat'
import { spawn } from 'child_process'
import { cpus } from 'os'
import endpoint from 'endpoint'
import { realpathSync } from 'fs'
import { extname, basename } from 'path'

let throat = new Throat(cpus().length || 1)

export function bmp2png(file) {
  return throat(
    () =>
      new Promise((resolve, reject) => {
        let convert = spawn('convert', [realpathSync(file.path), 'png:-'])
        convert.stdin.end()
        convert.stderr.on('data', (x) => process.stderr.write(x))
        let data = new Promise((resolve, reject) => {
          convert.stdout.pipe(
            endpoint((err, buffer) => {
              if (err) {
                console.error('Error reading converted data!')
                reject(err)
              } else {
                resolve(buffer)
              }
            })
          )
        })
        convert.on('close', (code) => {
          if (code === 0) {
            resolve(
              data.then((buffer) =>
                file.derive(
                  basename(file.name, extname(file.name)) + '.png',
                  buffer
                )
              )
            )
          } else {
            console.error('Unable to convert BMP file to PNG: ' + code)
            reject(new Error('convert exited: ' + code))
          }
        })
      })
  )
}

export default bmp2png
