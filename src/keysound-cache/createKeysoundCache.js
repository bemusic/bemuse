import invariant from 'invariant'

export function createKeysoundCache () {
  const map = new Map()
  let _lastSongId
  return {
    receiveSongId (nextSongId) {
      if (_lastSongId !== nextSongId) {
        _lastSongId = nextSongId
        map.clear()
      }
    },
    isEmpty () {
      return map.size === 0
    },
    isCached (soundName) {
      return map.has(soundName)
    },
    cache (soundName, audioBuffer) {
      invariant(_lastSongId, 'Expected current song to be set.')
      map.set(soundName, audioBuffer)
    },
    get (soundName) {
      return map.get(soundName)
    }
  }
}

export default createKeysoundCache
