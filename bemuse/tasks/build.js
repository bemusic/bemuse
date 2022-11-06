import buildConfig from '../config/buildConfig'
import config from '../config/webpack'
import fs from 'fs'
import gulp from 'gulp'
import log from 'fancy-log'
import path from '../config/path'
import webpack from 'webpack'

const { readFile, writeFile } = fs.promises

gulp.task(
  'build',
  gulp.series('dist', async function () {
    const stats = await new Promise((resolve, reject) =>
      webpack(config, (err, stats) => (!err ? resolve(stats) : reject(err)))
    )
    log('[webpack]', stats.toString({ colors: true }))
    if (stats.hasErrors()) {
      throw new Error(
        'Failed to build Bemuse, please check the logs above.... T_T'
      )
    }
    await postProcess()
  })
)

function postProcess() {
  return readFile(path('dist', 'index.html'), 'utf-8')
    .then(updateTitle)
    .then(inlineBootScript)
    .then(ssi)
    .then((result) => writeFile(path('dist', 'index.html'), result, 'utf-8'))
}

function updateTitle(html) {
  return html.replace(/<title>Bemuse/, (a) => {
    if (buildConfig.name === 'Bemuse') {
      return a
    }
    return `<meta name="robots" content="noindex" /><title>${buildConfig.name} ${buildConfig.version}`
  })
}

function inlineBootScript(html) {
  const re = /(<!--\sBEGIN BOOT SCRIPT\s-->)[\s\S]*(<!--\sEND BOOT SCRIPT\s-->)/
  const boot = fs.readFileSync(path('dist', 'build', 'boot.js'), 'utf-8')
  return html.replace(re, (x, a, b) => `${a}${scriptTag(boot)}${b}`)
}

function ssi(html) {
  const re = /<!--\s*#include file="([^"]+)"\s*-->/g
  return html.replace(re, (x, file) => fs.readFileSync(path('dist', file)))
}

function scriptTag(text) {
  return `<script>${text}</script>`
}
