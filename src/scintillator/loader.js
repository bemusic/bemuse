
import debug from 'debug/browser'
let log = debug('scintillator:loader')

import $ from 'jquery'
import url from 'url'
import co from 'co'
import PIXI from 'pixi.js'

import Resources from './resources'
import Compiler from './compiler'

export function load(xmlPath) {
  return co(function*() {

    log('load XML from %s', xmlPath)
    let $xml = yield loadXml(xmlPath)

    log('loading resources')
    let resources = new Resources()
    for (let image of Array.from($xml.children('image'))) {
      let src = $(image).attr('src')
      let imageUrl = url.resolve(xmlPath, src)
      resources.add(src, imageUrl)
    }
    yield loadResources(resources)

    log('compiling')
    let skin = new Compiler({ resources }).compile($xml)

    return skin

  })
}

function loadXml(url) {
  return Promise.resolve($.ajax({ url: url, dataType: 'xml' }))
    .then(xml => $(xml.documentElement))
}

function loadResources(resources) {
  log('loading resources')
  return new Promise(function(resolve) {
    let loader = new PIXI.AssetLoader(resources.urls)
    loader.on('onComplete', function() {
      log('resources finished loading')
      resolve()
    })
    loader.load()
  })
}
