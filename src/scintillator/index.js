
import Debug from 'debug/browser'
let debug = Debug('scintillator:loader')

import $ from 'jquery'
import url from 'url'
import promiseForPixi from './import-pixi'

import Resources from './resources'
import Compiler from './compiler'

/**
 * A Scintillator is Bemuse's graphics display engine based on PIXI.js.
 */
export class Scintillator {
  constructor({ PIXI, $xml, resources }) {
    this._PIXI = PIXI
    this._$xml = $xml
    this._resources = resources
  }
  compile(options={}) {
    let $xml = this._$xml
    new Compiler({ $xml }).compile()
    void options
  }
}

export function load(xmlPath) {
  debug('load XML from %s', xmlPath)
  let promiseForXml = loadXml(xmlPath)
  return Promise.all([promiseForPixi, promiseForXml])
  .then(([PIXI, $xml]) => {
    debug('PIXI and $xml loaded')
    let resources = new Resources()
    for (let image of Array.from($xml.children('image'))) {
      let src = $(image).attr('src')
      let imageUrl = url.resolve(xmlPath, src)
      resources.add(src, imageUrl)
    }
    return loadResources(resources).with(PIXI)
    .then(() => new Scintillator({ PIXI, $xml, resources }))
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

export default Scintillator
