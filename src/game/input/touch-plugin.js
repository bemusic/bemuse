
let BUTTONS = ['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6', 'p1_7', 'start']

export function TouchPlugin(context) {
  let scratchStartY = null
  let scratchY = null
  return {
    get() {
      let output = { }
      output['p1_SC'] = getScratch()
      for (let button of BUTTONS) {
        output[button] = getButton(button)
      }
      output['p1_pinch'] = getPinch()
      return output
    }
  }
  function getButton(button) {
    let objects = context.refs[button]
    if (objects) {
      for (let object of objects) {
        let bounds = object.getBounds()
        for (let input of context.input) {
          if (bounds.contains(input.x, input.y)) return 1
        }
      }
    }
    return 0
  }
  function getScratch() {
    let objects = context.refs['p1_SC']
    if (!objects) return
    scratchY = null
    for (let input of context.input) {
      for (let object of objects) {
        if (object.getBounds().contains(input.x, input.y)) {
          scratchY = input.y
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
  function getPinch() {
    let a = null
    let b = null
    for (let input of context.input) {
      if (input.y < 550) {
        if (a === null) {
          a = input.y
        } else if (b === null) {
          b = input.y
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
