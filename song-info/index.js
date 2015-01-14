
module.exports = SongInfo

function SongInfo() {
  this.title = 'NO TITLE'
  this.artist = 'NO ARTIST'
  this.genre = 'NO GENRE'
}

SongInfo.fromBMSChart = function(chart) {
  var info = new SongInfo()
  var title  = chart.headers.get('title')
  var artist = chart.headers.get('artist')
  var genre  = chart.headers.get('genre')
  if (title)  info.title  = title
  if (artist) info.artist = artist
  if (genre)  info.genre  = genre
  return info
}

