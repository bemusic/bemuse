
var match = require('../util/match')
var _     = require('../util/lodash')

module.exports = SongInfo

function SongInfo(info) {
  this.title      = 'NO TITLE'
  this.artist     = 'NO ARTIST'
  this.genre      = 'NO GENRE'
  this.subtitles  = []
  this.subartists = []
  this.difficulty = 0
  this.level      = 0
  if (info) _.assign(this, info)
}

SongInfo.fromBMSChart = function(chart) {
  var info       = { }
  var title      = chart.headers.get('title')
  var artist     = chart.headers.get('artist')
  var genre      = chart.headers.get('genre')
  var difficulty = +chart.headers.get('difficulty')
  var level      = +chart.headers.get('playlevel')
  var subtitles  = chart.headers.getAll('subtitle')
  var subartists = chart.headers.getAll('subartist')
  if (typeof title === 'string' && !subtitles) {
    var extractSubtitle = function(m) {
      title = m[1]
      subtitles = [m[2]]
    }
    match(title)
    .when(/^(.*\S)\s*-(.+?)-$/,   extractSubtitle)
    .when(/^(.*\S)\s*～(.+?)～$/, extractSubtitle)
    .when(/^(.*\S)\s*\((.+?)\)$/, extractSubtitle)
    .when(/^(.*\S)\s*\[(.+?)\]$/, extractSubtitle)
    .when(/^(.*\S)\s*<(.+?)>$/,   extractSubtitle)
  }
  if (title)      info.title      = title
  if (artist)     info.artist     = artist
  if (genre)      info.genre      = genre
  if (subtitles)  info.subtitles  = subtitles
  if (subartists) info.subartists = subartists
  if (difficulty) info.difficulty = difficulty
  if (level)      info.level      = level
  return new SongInfo(info)
}
