import { expect } from 'chai'
import NotechartLoader from '.'
import { PlayerOptions } from '../types'

const options: PlayerOptions = { scratch: 'left' }

describe('NotechartLoader', function() {
  describe('with BMS file', function() {
    it('should be able to read', async function() {
      let loader = new NotechartLoader()
      let buffer = Buffer.from(`#TITLE meow`)

      const notechart = await loader.load(buffer, { name: 'wow.bms' }, options)
      expect(notechart.songInfo.title).to.equal('meow')
    })
    it('also reads judge rank', async function() {
      let loader = new NotechartLoader()
      let buffer = Buffer.from(`#RANK 1`)

      const notechart = await loader.load(buffer, { name: 'wow.bms' }, options)
      expect(notechart.expertJudgmentWindow[0]).to.equal(15)
      expect(notechart.expertJudgmentWindow[1]).to.equal(30)
    })
  })

  describe('with bmson file', function() {
    it('should be able to read', async function() {
      let loader = new NotechartLoader()
      let data = {
        info: { title: 'Running Out' },
      }
      let buffer = Buffer.from(JSON.stringify(data))

      const notechart = await loader.load(
        buffer,
        { name: 'wow.bmson' },
        options
      )
      expect(notechart.songInfo.title).to.equal('Running Out')
    })
    it('should read the judge_rank of the song', async function() {
      let loader = new NotechartLoader()
      let data = {
        info: { title: 'Running Out', judge_rank: 200 },
      }
      let buffer = Buffer.from(JSON.stringify(data))

      const notechart = await loader.load(
        buffer,
        { name: 'wow.bmson' },
        options
      )
      expect(notechart.expertJudgmentWindow[0]).to.equal(36)
      expect(notechart.expertJudgmentWindow[1]).to.equal(80)
    })
  })
})
