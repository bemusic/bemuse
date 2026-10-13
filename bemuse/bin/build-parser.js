#!/usr/bin/env node
'use strict'

// Regenerates src/scintillator/expression/parser.js from parser.pegjs.
//
//   rushx build:parser
//
// parser.js is a committed build artifact (imported directly so the source
// doesn't depend on a webpack pegjs-loader). CI runs this script and fails if
// the committed file is out of date — see the "tidy" job in .github/workflows/ci.yml.

const fs = require('fs')
const path = require('path')
const peg = require('pegjs')

const dir = path.join(__dirname, '..', 'src', 'scintillator', 'expression')
const grammar = fs.readFileSync(path.join(dir, 'parser.pegjs'), 'utf8')

const header =
  '/* eslint-disable */\n' +
  '// GENERATED FILE — do not edit. Regenerate with `rushx build:parser`.\n'
// Emit an ES module (`export default <parser>`) rather than CommonJS so that
// Vite/Rollup resolve it natively without needing commonjs interop for a file
// living under src/. The `bare` format produces a self-contained parser object
// expression that we export directly.
const source = peg.generate(grammar, { output: 'source', format: 'bare' })

fs.writeFileSync(
  path.join(dir, 'parser.js'),
  `${header}export default ${source}`
)
