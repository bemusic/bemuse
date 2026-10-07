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

    it('folds keysound-ID case for base-36 charts (default)', async function () {
      const loader = new NotechartLoader()
      const buffer = Buffer.from(`#WAVAA cat.wav\n#00111:AA`)

      const notechart = await loader.load(buffer, { name: 'wow.bms' }, options)
      expect(notechart.keysounds).to.deep.equal({ aa: 'cat.wav' })
      // note.keysound is canonical, so a direct map lookup resolves it.
      const note = notechart.notes[0]
      expect(note.keysound).to.equal('aa')
      expect(notechart.keysounds[note.keysound]).to.equal('cat.wav')
    })

    it('keeps base-62 keysound IDs case-sensitive end-to-end', async function () {
      const loader = new NotechartLoader()
      const buffer = Buffer.from(
        `#BASE 62\n#WAVAa lower.wav\n#WAVAA upper.wav\n#00111:AaAA`
      )

      const notechart = await loader.load(buffer, { name: 'wow.bms' }, options)
      expect(notechart.keysounds).to.deep.equal({
        Aa: 'lower.wav',
        AA: 'upper.wav',
      })
      expect(notechart.samples.slice().sort()).to.deep.equal([
        'lower.wav',
        'upper.wav',
      ])
      // Each note's canonical keysound resolves to the correct (case-sensitive)
      // file via a direct map lookup — the same lookup the audio layer performs.
      const sounds = notechart.notes.map((n) => notechart.keysounds[n.keysound])
      expect(sounds).to.include('lower.wav')
      expect(sounds).to.include('upper.wav')
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
