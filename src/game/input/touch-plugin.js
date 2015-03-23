
let BUTTONS = ['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6', 'p1_7']

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
    scratchY = null
    for (let input of context.input) {
      if (input.x < 72) scratchY = input.y
    }
    if (scratchY === null) {
      scratchStartY = null
      return 0
    }
    if (scratchStartY === null) {
      scratchStartY = scratchY
    }
    return (
      scratchY > scratchStartY + 16 ? -1 :
      scratchY < scratchStartY - 16 ? 1 : 0
    )
  }
}

export default TouchPlugin
