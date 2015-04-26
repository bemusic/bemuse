
import bench from 'bemuse/devtools/benchmark'

let BUTTONS = ['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6', 'p1_7', 'start']

export function TouchPlugin(context) {
  let scratchStartY = null
  let scratchY = null
  let getInput = bench.wrap('input:touch:I', _getInput)
  let getScratch = bench.wrap('input:touch:SC', _getScratch)
  let getButton = bench.wrap('input:touch:B', _getButton)
  let getPinch = bench.wrap('input:touch:P', _getPinch)
  return {
    name: 'TouchPlugin',
    get() {
      let input = getInput()
      let output = { }
      if (bench.enabled) bench.stats['input:touch:n'] = '' + input.length
      output['p1_SC'] = getScratch(input)
      for (let button of BUTTONS) {
        output[button] = getButton(input, button)
      }
      output['p1_pinch'] = getPinch(input)
      return output
    }
  }
  function _getInput() {
    return context.input
  }
  function _getButton(input, button) {
    let objects = context.refs[button]
    if (objects) {
      for (let object of objects) {
        let bounds = object.getBounds()
        for (let p of input) {
          if (bounds.contains(p.x, p.y)) return 1
        }
      }
    }
    return 0
  }
  function _getScratch(input) {
    let objects = context.refs['p1_SC']
    if (!objects) return 0
    scratchY = null
    for (let p of input) {
      for (let object of objects) {
        if (object.getBounds().contains(p.x, p.y)) {
          scratchY = p.y
          break
        }
      }
      if (scratchY !== null) {
        break
      }
    }
    if (scratchY === null) {
      scratchStartY = null
      return 0
    }
    if (scratchStartY === null) {
      scratchStartY = scratchY
    }
    if (scratchY > scratchStartY + 16) {
      scratchStartY = scratchY - 16
    } else if (scratchY < scratchStartY - 16) {
      scratchStartY = scratchY + 16
    }
    return (
      scratchY > scratchStartY + 4 ? -1 :
      scratchY < scratchStartY - 4 ? 1 : 0
    )
  }
  function _getPinch(input) {
    let a = null
    let b = null
    for (let p of input) {
      if (p.y < 550) {
        if (a === null) {
          a = p.y
        } else if (b === null) {
          b = p.y
        } else {
          return 0
        }
      }
    }
    if (a !== null && b !== null) {
      return Math.abs(a - b)
    } else {
      return 0
    }
  }
}

export default TouchPlugin
