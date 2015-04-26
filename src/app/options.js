
// The structure of this may change in the future, so I'll keep this private.
const DEFAULTS = {

  // Keyboard
  'input.P1.keyboard.SC':       '16',
  'input.P1.keyboard.1':        '90',
  'input.P1.keyboard.2':        '83',
  'input.P1.keyboard.3':        '88',
  'input.P1.keyboard.4':        '68',
  'input.P1.keyboard.5':        '67',
  'input.P1.keyboard.6':        '70',
  'input.P1.keyboard.7':        '86',

  // Note speed
  'player.P1.speed':            '1.0',

  // Scratch placement (left, right, off)
  'player.P1.scratch':          'left',

  // Panel placement (left, center, right)
  'player.P1.panel':            'center',

  // Mirrors note
  'player.P1.notes.mirror':     '0',

  // Balances left-right hand usage
  'player.P1.notes.balance':    '0',

  // Offsets
  'system.offset.audio-input':  '0',
  'system.offset.audio-visual': '0',
}

export function get(key) {
  return localStorage[key] || DEFAULTS[key]
}

export function set(key, value) {
  localStorage[key] = value
}

export function getKeyboardMapping() {
  let out = { }
  for (let key of ['SC', '1', '2', '3', '4', '5', '6', '7']) {
    out[key] = +get('input.P1.keyboard.' + key)
  }
  return out
}
