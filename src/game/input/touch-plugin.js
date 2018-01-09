import bench from 'bemuse/devtools/benchmark'

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
function getRow (i) {
  let excess = Math.max(0, i - 1)
  if (i < 0) i = 0
  if (i > 1) i = 1
  let theta = TD_CONF.t0 + (TD_CONF.t1 - TD_CONF.t0) * i
  let pointX = TD_CONF.cx + Math.cos(theta) * TD_CONF.r
  let pointY = TD_CONF.cy - Math.sin(theta) * TD_CONF.r
  let projection = TD_CONF.p / (TD_CONF.p - pointX)
  let screenY = pointY * projection + 720 / 2
  return { y: screenY + excess * 1280, projection }
}

const TD_CONF = {
  cx: 1024,
  cy: -975,
  r: 1024,
  p: 960,
  w: 60,
  t0: 3.922,
  t1: 4.555
}

export function TouchPlugin (context) {
  let scratchStartY = null
  let scratchY = null
  let getInput = bench.wrap('input:touch:I', _getInput)
  let getScratch = bench.wrap('input:touch:SC', _getScratch)
  let getButton = bench.wrap('input:touch:B', _getButton)
  let getPinch = bench.wrap('input:touch:P', _getPinch)
  let statsRecorder = new StatsRecorder()
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
      for (let p of input) {
        let min = 0.75
        let max = 1
        let mid
        let row
        for (let i = 0; i < 8; i++) {
          mid = (min + max) / 2
          row = getRow(mid)
          if (row.y > p.y) {
            max = mid
          } else {
            min = mid
          }
        }
        if (mid < 0.8) continue
        let x0 = 1280 / 2 + row.projection * -TD_CONF.w
        let x1 = 1280 / 2 + row.projection * TD_CONF.w
        let pos = Math.floor((p.x - x0) / (x1 - x0) * 7)
        if (pos >= -1 && pos <= 7) {
          if (pos < 0) pos = 0
          if (pos > 6) pos = 6
          output['p1_' + (pos + 1)] = 1
        }
      }
      output['p1_pinch'] = getPinch(input)
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
    for (let p of input) {
      if (p.y < getRow(0.8).y /* 550 */) {
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
