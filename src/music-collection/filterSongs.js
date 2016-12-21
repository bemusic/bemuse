export function filterSongs (songs, filterText) {
  return songs.filter(song => matches(song, filterText))
}

function matches (song, filterText) {
  if (!filterText) return true
  return (
    contains(song.title, filterText) ||
    contains(song.artist, filterText) ||
    contains(song.genre, filterText)
  )
}

function contains (haystack, needle) {
  return String(haystack.toLowerCase()).indexOf(needle.toLowerCase()) >= 0
}

export default filterSongs
