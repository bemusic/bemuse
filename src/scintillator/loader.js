
import Debug from 'debug/browser'
let debug = Debug('scintillator:loader')

import $ from 'jquery'
import url from 'url'
import promiseForPixi from './pixi'
import co from 'co'

import Resources from './resources'
import Compiler from './compiler'

export function load(xmlPath) {
  return co(function*() {

    debug('load XML from %s', xmlPath)
    let [$xml, PIXI] = yield Promise.all([loadXml(xmlPath), promiseForPixi])

    debug('loading resources')
    let resources = new Resources()
    for (let image of Array.from($xml.children('image'))) {
      let src = $(image).attr('src')
      let imageUrl = url.resolve(xmlPath, src)
      resources.add(src, imageUrl)
    }
    yield loadResources(resources).with(PIXI)

    debug('compiling')
    let skin = new Compiler($xml).compile()

    return skin

  })
}

function loadXml(url) {
  return Promise.resolve($.ajax({ url: url, dataType: 'xml' }))
    .then(xml => $(xml.documentElement))
}

function loadResources(resources) {
  return {
    with: function(PIXI) {
      debug('loading resources')
      return new Promise(function(resolve) {
        let loader = new PIXI.AssetLoader(resources.urls)
        loader.on('onComplete', function() {
          debug('resources finished loading')
          resolve()
        })
        loader.load()
      })
    }
  }
}
