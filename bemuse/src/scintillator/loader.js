import * as PIXI from 'pixi.js'
import $ from 'jquery'
import debug from 'debug'
import { PERCENTAGE_FORMATTER } from 'bemuse/progress/formatters'

import Compiler from './compiler'
import Resources from './resources'

const log = debug('scintillator:loader')

export async function load(xmlPath, progress) {
  log('load XML from %s', xmlPath)
  const $xml = await loadXml(xmlPath)

  // scan all images
  const resources = new Resources()
  const paths = new Set()
  for (const element of Array.from($xml.find('[image]'))) {
    paths.add($(element).attr('image'))
  }
  for (const element of Array.from($xml.find('[font-src]'))) {
    paths.add($(element).attr('font-src'))
  }
  const base = new URL(xmlPath, 'file://')
  for (const path of paths) {
    const assetUrl = new URL(path, base)
    if (assetUrl.protocol === 'file:') {
      const { pathname, search, hash } = assetUrl
      resources.add(path, pathname + search + hash)
    } else {
      resources.add(path, assetUrl.toString())
    }
  }

  // load all images + progress reporting
  await loadResources(resources, progress)

  // compile the skin
  log('compiling')
  return new Compiler({ resources }).compile($xml)
}

function loadXml(xmlUrl) {
  return Promise.resolve($.ajax({ url: xmlUrl, dataType: 'xml' })).then((xml) =>
    $(xml.documentElement)
  )
}

function loadResources(resources, progress) {
  log('loading resources')
  return new Promise(function (resolve) {
    if (resources.urls.length === 0) return resolve()
    const loader = new PIXI.loaders.Loader()
    for (const url of resources.urls) {
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
