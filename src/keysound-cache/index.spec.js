import assert from 'power-assert'

import createKeysoundCache from './createKeysoundCache'

describe('A keysound cache', function () {
  it('starts empty', () => {
    const harness = setup()
    assert(harness.isEmpty())
  })

  it('can add keysound to the cache', () => {
    const harness = setup()
    harness.startSong('songId1')
    harness.cache('sound1', 'AudioBuffer1')
    assert(!harness.isEmpty())
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
      get: (soundName) => cache.get(soundName)
    }
  }
})
