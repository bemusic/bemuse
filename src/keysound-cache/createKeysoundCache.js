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
    cache (soundName, audioBuffer) {
      map.set(soundName, audioBuffer)
    },
    get (soundName) {
      return map.get(soundName)
    }
  }
}

export default createKeysoundCache
