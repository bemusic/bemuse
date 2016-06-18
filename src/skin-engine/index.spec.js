
import TEST_IMAGE_URL from 'file!./test-fixtures/test.png'
import { Sprite, Container, createContext } from './'

describe('skin engine', function () {
  it('should display sprites', async () => {
    // Basically, a skin is a function that takes a context.
    // It should declare any used resource, and then
    // it should return a draw function that calls draw to draw stuff.
    const SkinFactory = context => {
      const image = context.declareResource(TEST_IMAGE_URL)
      return (draw) => {
        draw.begin('container', Container, { })
        draw('sprite', Sprite, {
          image,
          width: 3,
          height: 1,
          frame: [ 12, 13, 10, 11 ],
          visible: true,
          blend: 'screen'
        })
        draw.end()
      }
    }

    const context = createContext()
    const Skin = SkinFactory(context)
    await context.load()
    context.draw(Skin)

    const stage = context.stage
    const frame = stage.children[0].texture.frame
    expect(frame.width).to.equal(10)
    expect(frame.height).to.equal(11)
    expect(frame.x).to.equal(12)
    expect(frame.y).to.equal(13)
    context.destroy()
  })
})
