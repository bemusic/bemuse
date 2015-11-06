
import debug from 'debug/browser'
let log = debug('scintillator:expression')

import parser from './parser.pegjs'

function createFunction (code) {
  let fn = eval('(function(get) { return ' + code + ' })') // eslint-disable-line no-eval
  fn.displayName = '(' + code + ')'
  fn.constant = !!/^[\-0-9\.]+$/.test(code)
  return fn
}

export function Expression (text) {
  log('parsing %s', text)
  let code = parser.parse(text)
  log('parsed %s => %s', text, code)
  let f = createFunction(code)
  let evaluate
  if (f.constant) {
    evaluate = f
  } else {
    evaluate = function (data) {
      return f(function (key) {
        return data[key]
      })
    }
  }
  evaluate.constant = f.constant
  return evaluate
}

export default Expression
