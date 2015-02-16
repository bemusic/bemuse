
import debug from 'debug/browser'
let log = debug('scintillator:loader')

import $ from 'jquery'
import url from 'url'
import co from 'co'
import PIXI from 'pixi.js'

import Resources from './resources'
import Compiler from './compiler'

export function load(xmlPath, task) {
  return co(function*() {

    let notify = task ? o => task.update(o) : () => {}

    log('load XML from %s', xmlPath)
    let $xml = yield loadXml(xmlPath)

    // scan all images
    let resources = new Resources()
    let images = Array.from($xml.children('image'))
    for (let image of images) {
      let src = $(image).attr('src')
      let imageUrl = url.resolve(xmlPath, src)
      resources.add(src, imageUrl)
    }

    // load all images + progress reporting
    log('loading resources')
    let loaded  = 1
    let total   = 1 + images.length
    let update  = () => notify({ progress: loaded / total })
    update()
    yield loadResources(resources, () => { loaded += 1; update() })

    // compile the skin
    log('compiling')
    let skin = new Compiler({ resources }).compile($xml)

    return skin

  })
}

function loadXml(url) {
  return Promise.resolve($.ajax({ url: url, dataType: 'xml' }))
    .then(xml => $(xml.documentElement))
}

function loadResources(resources, onprogress) {
  log('loading resources')
  return new Promise(function(resolve) {
    if (resources.urls.length === 0) return resolve()
    let loader = new PIXI.AssetLoader(resources.urls)
    loader.on('onComplete', function() {
      log('resources finished loading')
      resolve()
    })
    if (onprogress) loader.on('onProgress', onprogress)
    loader.load()
  })
}
