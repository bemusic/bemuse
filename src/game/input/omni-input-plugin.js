import { OmniInput } from 'bemuse/omni-input'

function OmniInputPlugin (game) {
  const input = new OmniInput(window, { exclusive: true })
  let kbm = game.players[0].options.input.keyboard
  return {
    name: 'GameKBPlugin',
    get () {
      const data = input.update()
      const result = {
        p1_1: data[kbm['1'] || '83'],
        p1_2: data[kbm['2'] || '68'],
        p1_3: data[kbm['3'] || '70'],
        p1_4: data[kbm['4'] || '32'],
        p1_5: data[kbm['5'] || '74'],
        p1_6: data[kbm['6'] || '75'],
        p1_7: data[kbm['7'] || '76'],
        p1_SC: data[kbm['SC'] || '65'] || -data[kbm['SC2'] || '16'],
        p1_speedup: data[38],
        p1_speeddown: data[40],
        start: data[13] || data['gamepad.0.button.9'],
        select: data[18] || data['gamepad.0.button.8']
      }
      if (result['start'] || result['select']) {
        if (
          result['p1_1'] ||
          result['p1_3'] ||
          result['p1_5'] ||
          result['p1_7']
        ) {
          result['p1_speeddown'] = true
        }
        if (result['p1_2'] || result['p1_4'] || result['p1_6']) {
          result['p1_speedup'] = true
        }
      }
      return result
    },
    destroy () {
      input.dispose()
    }
  }
}

export default OmniInputPlugin
