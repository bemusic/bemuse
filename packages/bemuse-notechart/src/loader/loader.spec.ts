import { expect } from 'chai'
import NotechartLoader from '.'
import { PlayerOptions } from '../types'

const options: PlayerOptions = { scratch: 'left' }

describe('NotechartLoader', function () {
  describe('with BMS file', function () {
    it('should be able to read', async function () {
      const loader = new NotechartLoader()
      const buffer = Buffer.from(`#TITLE meow`)

      const notechart = await loader.load(buffer, { name: 'wow.bms' }, options)
      expect(notechart.songInfo.title).to.equal('meow')
    })
    it('also reads judge rank', async function () {
      const loader = new NotechartLoader()
      const buffer = Buffer.from(`#RANK 1`)

      const notechart = await loader.load(buffer, { name: 'wow.bms' }, options)
      expect(notechart.expertJudgmentWindow[0]).to.equal(15)
      expect(notechart.expertJudgmentWindow[1]).to.equal(30)
    })
    it('loads landmine objects', async function () {
      const loader = new NotechartLoader()
      const buffer = Buffer.from(`#001D2:010203`)

      const notechart = await loader.load(buffer, { name: 'wow.bms' }, options)
      expect(notechart.landmines.length).to.equal(3)
    })
  })

  describe('with bmson file', function () {
    it('should be able to read', async function () {
      const loader = new NotechartLoader()
      const data = {
        info: { title: 'Running Out' },
      }
      const buffer = Buffer.from(JSON.stringify(data))

      const notechart = await loader.load(
        buffer,
        { name: 'wow.bmson' },
        options
      )
      expect(notechart.songInfo.title).to.equal('Running Out')
    })
    it('should read the judge_rank of the song', async function () {
      const loader = new NotechartLoader()
      const data = {
        info: { title: 'Running Out', judge_rank: 200 },
      }
      const buffer = Buffer.from(JSON.stringify(data))

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
