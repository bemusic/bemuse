
import express    from 'express'
import http       from 'http'

import path             from '../../../config/path'
import testMiddleware   from '../test-middleware'

export function start() {

  return new Promise(function(resolve, reject) {

    let app = express()
    let server = http.createServer(app)

    server.testResult = new Promise(function(resolve) {
      app.use('/api/test', testMiddleware(function(result) {
        resolve(result)
      }))
    })

    app.use(express.static(path('dist')))

    server.listen(0, function(err) {
      if (err) return reject(err)
      resolve(server)
    })

  })

}

