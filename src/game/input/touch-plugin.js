import bench from 'bemuse/devtools/benchmark'

import * as touch3d from '../display/touch3d'

let BUTTONS = ['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6', 'p1_7', 'start']

window.BEMUSE_TOUCH_STATS = []

function StatsRecorder () {
  const stats = []
  window.BEMUSE_TOUCH_STATS.push(stats)
  return {
    record (input) {
      for (let { x, y } of input) {
        stats.push({ x: Math.round(x), y: Math.round(y) })
      }
    },
    done () {
      if (stats.length) {
        localStorage['_stats_touch'] = JSON.stringify(window.BEMUSE_TOUCH_STATS)
      }
    }
  }
}

export function TouchPlugin (context) {
  let scratchStartY = null
  let scratchY = null
  let getInput = bench.wrap('input:touch:I', _getInput)
  let getScratch = bench.wrap('input:touch:SC', _getScratch)
  let getButton = bench.wrap('input:touch:B', _getButton)
  let getPinch = bench.wrap('input:touch:P', _getPinch)
  let statsRecorder = new StatsRecorder()
  const touch3dMode = context.skinData.displayMode === 'touch3d'
  return {
    name: 'TouchPlugin',
    get () {
      let input = getInput()
      let output = {}
      if (bench.enabled) bench.stats['input:touch:n'] = '' + input.length
      statsRecorder.record(input)
      output['p1_SC'] = getScratch(input)
      for (let button of BUTTONS) {
        output[button] = getButton(input, button)
      }
      if (touch3dMode) {
        for (let p of input) {
          const lane = touch3d.getTouchedColumn(p.x, p.y)
          if (lane) output['p1_' + lane] = 1
        }
      } else {
        output['p1_pinch'] = getPinch(input)
      }
      return output
    },
    destroy () {
      statsRecorder.done()
    }
  }
  function _expand (rectangle, amount = 4) {
    const newRect = rectangle.clone()
    newRect.x -= amount
    newRect.y -= amount
    newRect.width += amount * 2
    newRect.height += amount * 2
    return newRect
  }
  function _getInput () {
    return context.input
  }
  function _getButton (input, button) {
    let objects = context.refs[button]
    if (objects) {
      for (let object of objects) {
        let bounds = _expand(object.getBounds())
        for (let p of input) {
          if (bounds.contains(p.x, p.y)) return 1
        }
      }
    }
    return 0
  }
  function _getScratch (input) {
    let objects = context.refs['p1_SC']
    if (!objects) return 0
    scratchY = null
    for (let p of input) {
      for (let object of objects) {
        if (_expand(object.getBounds(), 32).contains(p.x, p.y)) {
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
    if (scratchY > scratchStartY + 24) {
      scratchStartY = scratchY - 24
    } else if (scratchY < scratchStartY - 24) {
      scratchStartY = scratchY + 24
    }
    return scratchY > scratchStartY + 4
      ? -1
      : scratchY < scratchStartY - 4 ? 1 : 0
  }
  function _getPinch (input) {
    let a = null
    let b = null
    const pinchThreshold = touch3dMode ? touch3d.getRow(0.8).y : 550
    for (let p of input) {
      if (p.y < pinchThreshold) {
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
