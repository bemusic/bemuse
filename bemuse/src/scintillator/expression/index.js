import debug from 'debug'

import parser from './parser.pegjs'

const log = debug('scintillator:expression')

function createFunction(code) {
  const fn = eval('(function(get) { return ' + code + ' })') // eslint-disable-line no-eval
  fn.displayName = '(' + code + ')'
  fn.constant = !!/^[-0-9.]+$/.test(code)
  return fn
}

export function Expression(text) {
  log('parsing %s', text)
  const code = parser.parse(text)
  log('parsed %s => %s', text, code)
  const f = createFunction(code)
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
