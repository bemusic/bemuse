
import debug from 'debug/browser'
let log = debug('scintillator:expression')

import parser from './parser.pegjs'

function createFunction(code) {
  return eval('(function(get) { return ' + code + ' })')
}

export function Expression(text) {
  log('parsing %s', text)
  let code = parser.parse(text)
  log('parsed %s => %s', text, code)
  let f = createFunction(code)
  return function(data) {
    return f(function(key) {
      void data
      void key
      return Math.random()
    })
  }
}

export default Expression
