import { loadSongFromResources } from './'

describe('SongLoader', function () {
  function buffer(text) {
    return Promise.resolve(Buffer.from(text).buffer)
  }

  function createResources(files) {
    return {
      fileList: Promise.resolve(Object.keys(files)),
      file(name) {
        return Promise.resolve(files[name])
      },
    }
  }

  describe('with BMS files', function () {
    const resources = createResources({
      '01.bme': {
        read() {
          return buffer('#TITLE meow [NORMAL]\n#BPM 90\n#00111:01')
        },
      },
      '02.bms': {
        read() {
          return buffer('#TITLE meow [HYPER]\n#BPM 90\n#00111:01')
        },
      },
      '03.bml': {
        read() {
          return buffer('#TITLE meow [ANOTHER]\n#BPM 100\n#00111:01')
        },
      },
    })
    let song
    before(async function () {
      const options = { onMessage: (msg) => console.log(msg) }
      const x = await loadSongFromResources(resources, options)
      song = x
    })
    it('should have correct title', function () {
      expect(song.title).to.equal('meow')
    })
    it('should have correct number of charts', function () {
      expect(song.charts).to.have.length(3)
    })
    it('should have resources key pointing to the resources', function () {
      expect(song.resources).to.equal(resources)
    })
  })

  describe('with bmson files', function () {
    const resources = createResources({
      '01.bmson': {
        read() {
          return buffer('{"info":{"title":"meow","initBPM":90}}')
        },
      },
    })
    let song
    before(async function () {
      const x = await loadSongFromResources(resources)
      song = x
    })
    it('should have correct title', function () {
      expect(song.title).to.equal('meow')
    })
    it('should have correct number of charts', function () {
      expect(song.charts).to.have.length(1)
    })
  })
})
