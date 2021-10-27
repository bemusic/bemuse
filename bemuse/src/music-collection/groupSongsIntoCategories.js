import _ from 'lodash'
import { SongOfTheDay } from './SongOfTheDay'

const grouping = [
  { title: 'Custom Song', criteria: (song) => song.custom },
  { title: 'Tutorial', criteria: (song) => song.tutorial },
  {
    title: 'Random Songs of the Day',
    criteria: (song, context) => context.songOfTheDay.isSongOfTheDay(song.id),
  },
  { title: 'Unreleased', criteria: (song) => song.unreleased },
  {
    title: 'Recently Added Songs',
    criteria: (song) =>
      song.added && Date.now() - Date.parse(song.added) < 60 * 86400000,
    sort: (song) => song.added,
    reverse: true,
  },
  { title: '☆', criteria: () => true },
]

export function groupSongsIntoCategories(
  songs,
  { songOfTheDayEnabled = false } = {}
) {
  const context = {
    songOfTheDay: new SongOfTheDay(songs, { enabled: songOfTheDayEnabled }),
  }
  let groups = grouping.map((group) => ({
    input: group,
    output: { title: group.title, songs: [] },
  }))
  for (let song of songs) {
    for (let { input, output } of groups) {
      if (input.criteria(song, context)) {
        output.songs.push(song)
        break
      }
    }
  }
  for (let { input, output } of groups) {
    if (input.sort) {
      output.songs = _.orderBy(
        output.songs,
        [input.sort],
        [input.reverse ? 'desc' : 'asc']
      )
    } else if (input.reverse) {
      output.songs.reverse()
    }
  }
  return _(groups)
    .map('output')
    .filter((group) => group.songs.length > 0)
    .value()
}

export default groupSongsIntoCategories
