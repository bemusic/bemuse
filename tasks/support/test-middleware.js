
import { Router } from 'express'
import { json }   from 'body-parser'

export default function testMiddleware(callback) {
  var router = new Router()
  router.use(json({ limit: '16mb' }))
  router.post('/', function(req, res, next) {
    res.json({ thanks: 'Thank you!' })
    callback(req.body)
  })
  return router
}
