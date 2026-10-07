import { expect } from 'chai'
import { getYouTubeVideoId } from './YouTube'

describe('getYouTubeVideoId', () => {
  const id = 'gqHJqlaL_3I'

  it('reads a watch URL', () => {
    expect(getYouTubeVideoId(`https://www.youtube.com/watch?v=${id}`)).to.equal(
      id
    )
    expect(
      getYouTubeVideoId(`https://www.youtube.com/watch?feature=x&v=${id}&t=5`)
    ).to.equal(id)
  })

  it('reads a youtu.be short link', () => {
    expect(getYouTubeVideoId(`https://youtu.be/${id}`)).to.equal(id)
    expect(getYouTubeVideoId(`https://youtu.be/${id}?t=5`)).to.equal(id)
  })

  it('reads embed and shorts URLs', () => {
    expect(getYouTubeVideoId(`https://www.youtube.com/embed/${id}`)).to.equal(
      id
    )
    expect(getYouTubeVideoId(`https://www.youtube.com/shorts/${id}`)).to.equal(
      id
    )
  })

  it('returns undefined when there is no video ID', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/')).to.equal(undefined)
    expect(getYouTubeVideoId('not a url')).to.equal(undefined)
  })
})
