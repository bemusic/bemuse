
import debug from 'debug/browser'
let log = debug('scintillator:loader')

import $    from 'jquery'
import url  from 'url'
import co   from 'co'
import PIXI from 'pixi.js'
import { PERCENTAGE_FORMATTER } from 'bemuse/progress/formatters'

import Resources  from './resources'
import Compiler   from './compiler'

export function load (xmlPath, progress) {
  return co(function*() {

    log('load XML from %s', xmlPath)
    let $xml = yield loadXml(xmlPath)

    // scan all images
    let resources = new Resources()
    let paths     = new Set()
    for (let element of Array.from($xml.find('[image]'))) {
      paths.add($(element).attr('image'))
    }
    for (let element of Array.from($xml.find('[font-src]'))) {
      paths.add($(element).attr('font-src'))
    }
    for (let path of paths) {
      let assetUrl = url.resolve(xmlPath, path)
      resources.add(path, assetUrl)
    }

    // load all images + progress reporting
    yield loadResources(resources, progress)

    // compile the skin
    log('compiling')
    let skin = new Compiler({ resources }).compile($xml)

    return skin

  })
}

function loadXml (xmlUrl) {
  return Promise.resolve($.ajax({ url: xmlUrl, dataType: 'xml' }))
    .then(xml => $(xml.documentElement))
}

function loadResources (resources, progress) {
  log('loading resources')
  return new Promise(function (resolve) {
    if (resources.urls.length === 0) return resolve()
    let loader = new PIXI.loaders.Loader()
    for (let url of resources.urls) {
      loader.add(url, url)
    }
    loader.once('complete', function () {
      log('resources finished loading')
      resolve()
    })
    if (progress) {
      progress.formatter = PERCENTAGE_FORMATTER
      loader.once('complete', function () {
        progress.report(100, 100)
      })
      loader.on('progress', function () {
        progress.report(loader.progress, 100)
      })
    }
    loader.load()
  })
}
