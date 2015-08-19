
import _    from 'lodash'
import BMS  from 'bms'

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
      info:       getSongInfo(bmson.info),
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

export function getSongInfo(bmsonInfo) {
  var info = new BMS.SongInfo()
  if (bmsonInfo.title)  info.title  = bmsonInfo.title
  if (bmsonInfo.artist) info.artist = bmsonInfo.artist
  if (bmsonInfo.genre)  info.genre  = bmsonInfo.genre
  if (bmsonInfo.level)  info.level  = bmsonInfo.level
  info.subtitles = ['[bmson parser alpha v0.21]']
  return info
}

export function getBarLines(lines) {
  return _(lines).map(({ y }) => beatForLoc(y)).sortBy().value()
}

export function getTimingInfo(bmson) {
  return {
    initialBPM: bmson.info.initBPM,
    actions:    (
      (bmson.bpmNotes || []).map(({ y, v }) => ({
        type: 'bpm', beat: beatForLoc(y), bpm: v,
      }))
    ),
  }
}

export function getMusicalScore(bmson, timing) {
  let notes               = [ ]
  let keysounds           = { }
  let nextKeysoundNumber  = 1
  if (bmson.soundChannel) {
    for (let { name, notes: soundChannelNotes } of bmson.soundChannel) {

      let sortedNotes     = _.sortBy(soundChannelNotes, 'y')
      let keysoundNumber  = nextKeysoundNumber++
      let keysoundId      = _.padLeft('' + keysoundNumber, 4, '0')
      let slices          = getSlices(soundChannelNotes, timing)

      keysounds[keysoundId] = name

      for (let { x, y, l } of sortedNotes) {
        let note = {
          column:     getColumn(x),
          beat:       beatForLoc(y),
          keysound:   keysoundId,
          endBeat:    undefined,
        }
        if (l > 0) {
          note.endBeat = beatForLoc(y + l)
        }
        let slice = slices.get(y)
        if (slice) {
          Object.assign(note, slice)
          notes.push(note)
        }
      }
    }
  }
  return {
    notes:      new BMS.Notes(notes),
    keysounds:  new BMS.Keysounds(keysounds),
  }
}

export function getSlices(notes, timing) {

  let all     = new Set()
  let play    = new Set()
  let restart = new Set()

  for (let { x, y, c } of notes) {
    let column = getColumn(x)
    all.add(y)
    if (column) {
      play.add(y)
    }
    if (!c) {
      restart.add(y)
    }
  }

  let result    = new Map()
  let soundTime = null
  let mustAdd   = true
  let tʹ
  let lastAdded

  for (let y of _.sortBy([...all])) {
    let t = timing.beatToSeconds(beatForLoc(y))
    if (soundTime === null || restart.has(y)) {
      soundTime = 0
    } else {
      soundTime += t - tʹ
    }
    let shouldAdd = mustAdd || play.has(y) || restart.has(y)
    if (shouldAdd) {
      if (lastAdded && !restart.has(y)) {
        lastAdded.keysoundEnd = soundTime
      }
      let obj = { keysoundStart: soundTime, keysoundEnd: undefined }
      result.set(y, obj)
      lastAdded = obj
    }
    mustAdd = play.has(y)
    tʹ = t
  }

  return result
}

export function beatForLoc(y) {
  return y / 240
}

export function getColumn(x) {
  switch (x) {
    case 1: return '1'
    case 2: return '2'
    case 3: return '3'
    case 4: return '4'
    case 5: return '5'
    case 6: return '6'
    case 7: return '7'
    case 8: return 'SC'
  }
  return undefined
}
