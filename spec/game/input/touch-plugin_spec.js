
import PIXI from 'pixi.js'
import TouchPlugin from 'bemuse/game/input/touch-plugin'

describe('TouchPlugin', function () {
  it('should get value when touching', function () {
    let instance = new TouchPlugin({
      refs: {
        'p1_1': new Set([
          { getBounds: () => new PIXI.Rectangle(64, 64, 64, 64) },
        ]),
        'p1_2': new Set([
          { getBounds: () => new PIXI.Rectangle(128, 64, 64, 64) },
        ]),
      },
      input: [
        { x: 72, y: 72, id: 'touch1' },
        { x: 32, y: 32, id: 'touch2' },
      ],
    })
    let data = instance.get()
    expect(data['p1_1']).to.equal(1)
    expect(data['p1_2']).to.equal(0)
  })
})
