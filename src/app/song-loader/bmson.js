
import BMS from 'bms'

export function getInfo(buffer, metadata) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(new Error('Unable to read file.'))
    }
    reader.readAsText(new Blob([buffer]), 'UTF-8')
  })
  .then(function (json) {
    return JSON.parse(json)
  })
  .then(function (bmson) {
    console.warn('BMSON implementation is experimental!')
    return {
      md5:        metadata.md5,
      info:       getBMSInfo(bmson.info),
      noteCount:  -1,
      scratch:    true,
      keys:       '7K',
      bpm:        {
        init:     bmson.info.initBPM,
        min:      bmson.info.initBPM,
        median:   bmson.info.initBPM,
        max:      bmson.info.initBPM,
      }
    }
  })
}

function getBMSInfo(bmsonInfo) {
  var info = new BMS.SongInfo()
  if (bmsonInfo.title)  info.title  = bmsonInfo.title
  if (bmsonInfo.artist) info.artist = bmsonInfo.artist
  if (bmsonInfo.genre)  info.genre  = bmsonInfo.genre
  if (bmsonInfo.level)  info.level  = bmsonInfo.level
  info.genre += ' [BMSON Parser BETA]'
  return info
}
