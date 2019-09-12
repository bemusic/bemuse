import download from 'bemuse/utils/download'
import { decodeOGG } from './ogg'

describe('ogg decoder', () => {
  it('can decode ogg file', async () => {
    const arrayBuffer = await download(
      require('./fixtures/guitar-slice-007.ogg')
    ).as('arraybuffer')
    const decoded = await decodeOGG(new AudioContext(), arrayBuffer)
    expect(decoded.duration).to.closeTo(0.04510204081632653, 0.001)
  })
})
