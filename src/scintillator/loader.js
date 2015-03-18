
import debug from 'debug/browser'
let log = debug('scintillator:loader')

import $    from 'jquery'
import url  from 'url'
import co   from 'co'
import PIXI from 'pixi.js'
import R    from 'ramda'
import * as ProgressUtils from 'bemuse/progress/utils'

import Resources  from './resources'
import Compiler   from './compiler'

export function load(xmlPath, progress) {
  return co(function*() {

    log('load XML from %s', xmlPath)
    let $xml = yield loadXml(xmlPath)

    // scan all images
    let resources = new Resources()
    let images = R.uniq(Array.from($xml.find('[image]'))
          .map(element => $(element).attr('image')))
    for (let src of images) {
      let imageUrl = url.resolve(xmlPath, src)
      resources.add(src, imageUrl)
    }

    // load all images + progress reporting
    let onload = ProgressUtils.fixed(1 + images.length, progress)
    onload()
    yield loadResources(resources, onload)

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
