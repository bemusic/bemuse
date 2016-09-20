import assert from 'power-assert'

import createKeysoundCache from './createKeysoundCache'

describe('A keysound cache', function () {
  it('starts empty', () => {
    const harness = setup()
    assert(harness.isEmpty())
  })

  it('is unusable until song is selected', () => {
    const harness = setup()
    assert.throws(() => {
      harness.cache('sound1', 'AudioBuffer1')
    })
  })

  it('can add keysound to the cache', () => {
    const harness = setup()
    harness.startSong('songId1')
    harness.cache('sound1', 'AudioBuffer1')
    assert(!harness.isEmpty())
    assert(harness.isCached('sound1') === true)
    assert(harness.get('sound1') === 'AudioBuffer1')
  })

  it('keeps keysounds in the cache if song did not change', () => {
    const harness = setup()
    harness.startSong('songId1')
    harness.cache('sound1', 'AudioBuffer1')
    harness.startSong('songId1')
    assert(!harness.isEmpty())
  })

  it('clears when song change', () => {
    const harness = setup()
    harness.startSong('songId1')
    harness.cache('sound1', 'AudioBuffer1')
    harness.startSong('songId2')
    assert(harness.isEmpty())
  })

  function setup () {
    const cache = createKeysoundCache()
    return {
      startSong: (songId) => cache.receiveSongId(songId),
      cache: (soundName, audioBuffer) => cache.cache(soundName, audioBuffer),
      isEmpty: () => cache.isEmpty(),
      isCached: (soundName) => cache.isCached(soundName),
      get: (soundName) => cache.get(soundName)
    }
  }
})
