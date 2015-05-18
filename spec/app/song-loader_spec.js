
import { loadSongFromResoures } from 'bemuse/app/song-loader'

describe('SongLoader', function() {
  function buffer(text) {
    return Promise.resolve(new Buffer(text).buffer)
  }
  let files = {
    '01.bme': {
      read() {
        return buffer('#TITLE meow [NORMAL]\n#BPM 90\n#00111:01')
      }
    },
    '02.bms': {
      read() {
        return buffer('#TITLE meow [HYPER]\n#BPM 90\n#00111:01')
      }
    },
    '03.bml': {
      read() {
        return buffer('#TITLE meow [ANOTHER]\n#BPM 100\n#00111:01')
      }
    }
  }
  let resources = {
    fileList: Promise.resolve(['01.bme', '02.bms', '03.bml']),
    file(name) { return Promise.resolve(files[name]) }
  }
  let song
  before(function() {
    let options = { onMessage: msg => console.log(msg) }
    return Promise.resolve(loadSongFromResoures(resources, options))
    .tap(x => song = x)
  })
  it('should have correct title', function() {
    expect(song.title).to.equal('meow')
  })
  it('should have correct number of charts', function() {
    expect(song.charts).to.have.length(3)
  })
})
