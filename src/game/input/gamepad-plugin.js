
let gamepads = []

window.addEventListener('gamepadconnected', function(e) {
  gamepads.push(e.gamepad)
})

export function GamepadPlugin() {
  function button(i) {
    return gamepads.some(gamepad => gamepad.buttons[i].pressed)
  }
  function axis(i) {
    for (var j = 0; j < gamepads.length; j++) {
      var gamepad = gamepads[j]
      if (Math.abs(gamepad.axes[i]) > 0.01) return gamepad.axes[i]
    }
    return 0
  }
  return {
    name: 'GamepadPlugin',
    get() {
      var out = {
        'p1_1': button(3),
        'p1_2': button(6),
        'p1_3': button(2),
        'p1_4': button(7),
        'p1_5': button(1),
        'p1_6': button(4),
        'p1_7': axis(3) || axis(0),
        'p1_SC': axis(4) || axis(1),
        'start': button(9),
        'select': button(8),
      }
      out['p1_speedup'] = (out['start'] || out['select']) && (
        out['p1_2'] || out['p1_4'] || out['p1_6'])
      out['p1_speeddown'] = (out['start'] || out['select']) && (
        out['p1_1'] || out['p1_3'] || out['p1_5'] || out['p1_7'])
      return out
    }
  }
}

export default GamepadPlugin
