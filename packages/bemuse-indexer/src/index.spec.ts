import { BPMInfo, OutputSongInfo } from './types'
import { expect } from 'chai'
import * as indexer from '.'

describe('getFileInfo (bms)', function() {
  function info(source: string) {
    return indexer.getFileInfo(Buffer.from(source), { name: 'meow.bms' })
  }

  describe('.md5', function() {
    it('should return hash', async function() {
      return expect((await info('')).md5).to.equal(
        'd41d8cd98f00b204e9800998ecf8427e'
      )
    })
  })

  describe('.info', function() {
    it('should return song info', async function() {
      var source = '#TITLE meow'
      return expect((await info(source)).info.title).to.equal('meow')
    })
  })

  describe('.noteCount', function() {
    it('should not count BGM', async function() {
      var source = '#00101:01'
      return expect((await info(source)).noteCount).to.equal(0)
    })
    it('should count playable notes', async function() {
      var source = '#00111:01'
      return expect((await info(source)).noteCount).to.equal(1)
    })
  })

  describe('.scratch', function() {
    it('is false when no scratch track', async function() {
      var source = '#00101:01'
      return expect((await info(source)).scratch).to.be.false
    })
    it('should count playable notes', async function() {
      var source = '#00116:01'
      return expect((await info(source)).scratch).to.be.true
    })
  })

  describe('.keys', function() {
    it('should be empty when no notes', async function() {
      var source = '#00101:01'
      return expect((await info(source)).keys).to.equal('empty')
    })
    it('should be 7K on normal chart', async function() {
      var source = ['#00111:01', '#00114:01', '#00159:0101'].join('\n')
      return expect((await info(source)).keys).to.equal('7K')
    })
    it('should be 5K when 6th and 7th keys not detected', async function() {
      var source = ['#00111:01', '#00114:01'].join('\n')
      return expect((await info(source)).keys).to.equal('5K')
    })
    it('should be 14K on doubles chart', async function() {
      var source = [
        '#00111:01',
        '#00114:01',
        '#00159:0101',
        '#00121:01',
        '#00124:01',
        '#00129:0101',
      ].join('\n')
      return expect((await info(source)).keys).to.equal('14K')
    })
    it(
      'should be 10K when 2 players and ' + '6th and 7th keys not detected',
      async function() {
        var source = ['#00111:01', '#00114:01', '#00121:01', '#00124:01'].join(
          '\n'
        )
        return expect((await info(source)).keys).to.equal('10K')
      }
    )
  })

  describe('.duration', function() {
    it('should be correct', async function() {
      var source = ['#BPM 120', '#00111:0101'].join('\n')
      return expect((await info(source)).duration).to.equal(3)
    })
  })

  describe('.bpm', function() {
    var source = [
      '#BPM 120',
      '#BPM01 240',
      '#00111:01',
      '#00108:01',
      '#00203:3C78',
      '#00211:01',
      '#00311:01',
    ].join('\n')

    var bpm: BPMInfo

    beforeEach(async function() {
      const fileInfo = await info(source)
      bpm = fileInfo.bpm
    })

    it('init should be the BPM at first beat', function() {
      expect(bpm.init).to.equal(120)
    })
    it('median should be the median BPM', function() {
      expect(bpm.median).to.equal(120)
    })
    it('min should be the minimum BPM', function() {
      expect(bpm.min).to.equal(60)
    })
    it('max should be the maximum BPM', function() {
      expect(bpm.max).to.equal(240)
    })
  })
})

describe('getFileInfo (bmson)', function() {
  function info(bmson: any) {
    var source = JSON.stringify(bmson)
    return indexer.getFileInfo(Buffer.from(source), { name: 'meow.bmson' })
  }

  describe('.info', function() {
    it('should return song info', async function() {
      const out = await info({ info: { title: 'Running Out' } })
      return expect(out.info.title).to.equal('Running Out')
    })
  })

  describe('.bga', function() {
    it('is undefined if no bga', async function() {
      const out = await info({ info: { title: 'Running Out' } })
      return expect(out.bga).to.equal(undefined)
    })
    it('has timing ', async function() {
      var bmsonData = {
        version: '1.0.0',
        info: {
          title: 'Meow',
          init_bpm: 42,
        },
        bga: {
          bga_events: [{ id: 1, y: 240 }],
          bga_header: [{ id: 1, name: 'meow.mp4' }],
        },
      }
      const out = await info(bmsonData)
      return expect(out.bga).to.deep.equal({
        file: 'meow.mp4',
        offset: 60 / 42,
      })
    })
  })
})

describe('getSongInfo', function() {
  describe('with multiple files', function() {
    var files = [
      {
        name: '01.bms',
        data: Buffer.from(
          '#TITLE meow [NORMAL]\n' +
            '#ARTIST lol\n' +
            '#PLAYLEVEL 5\n' +
            '#BPM 123\n' +
            '#00111:1111'
        ),
      },
      {
        name: '02.bms',
        data: Buffer.from(
          '#TITLE meow [HYPER]\n' +
            '#ARTIST lol\n' +
            '#PLAYLEVEL 7\n' +
            '#BPM 123\n' +
            '#00111:1111'
        ),
      },
      {
        name: '03.bms',
        data: Buffer.from(
          '#TITLE meow [ANOTHER]\n' +
            '#ARTIST lol\n' +
            '#PLAYLEVEL 12\n' +
            '#BPM 123\n' +
            '#00111:1111'
        ),
      },
    ]

    var song: OutputSongInfo

    beforeEach(async function() {
      const songInfo = await indexer.getSongInfo(files)
      song = songInfo
    })

    describe('title', function() {
      it('should be correct', function() {
        expect(song.title).to.equal('meow')
      })
    })
    describe('artist', function() {
      it('should be correct', function() {
        expect(song.artist).to.equal('lol')
      })
      it('should be overridable', async function() {
        var options = { extra: { artist: 'meowmeow' } }
        const out = await indexer.getSongInfo(files, options)
        return expect(out.artist).to.equal('meowmeow')
      })
    })
    describe('charts', function() {
      it('should be an array of charts', function() {
        expect(song.charts).to.have.length(3)
      })
      it('should have the file key', function() {
        expect(song.charts[0].file).to.match(/\.bms/)
      })
    })
    describe('progress report', function() {
      it('should report progress', function() {
        var options = { onProgress: onProgress }
        var callCount = 0
        function onProgress() {
          callCount += 1
        }
        return indexer.getSongInfo(files, options).then(function() {
          expect(callCount).to.equal(3)
        })
      })
    })
  })

  describe('a song’s video', function() {
    it('is taken from an available bga in a chart', function() {
      var charts = [{}, { bga: { file: 'a.mp4', offset: 2 } }, {}] as any
      expect(indexer._getSongVideoFromCharts(charts).video_file).to.equal(
        'a.mp4'
      )
      expect(indexer._getSongVideoFromCharts(charts).video_offset).to.equal(2)
    })
  })
})
