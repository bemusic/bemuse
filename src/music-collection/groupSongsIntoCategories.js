import _ from 'lodash'

const grouping = [
  { title: 'Custom Song', criteria: song => song.custom },
  { title: 'Tutorial', criteria: song => song.tutorial },
  { title: 'Unreleased', criteria: song => song.unreleased },
  { title: 'New Songs',
    criteria: song => song.added &&
        Date.now() - Date.parse(song.added) < 14 * 86400000,
    sort: song => song.added,
    reverse: true },
  { title: '☆', criteria: () => true }
]

export function groupSongsIntoCategories (songs) {
  let groups = grouping.map(group => ({
    input: group,
    output: { title: group.title, songs: [ ] }
  }))
  for (let song of songs) {
    for (let { input, output } of groups) {
      if (input.criteria(song)) {
        output.songs.push(song)
        break
      }
    }
  }
  for (let { input, output } of groups) {
    if (input.sort) output.songs = _.sortBy(output.songs, input.sort)
    if (input.reverse) output.songs.reverse()
  }
  return (_(groups)
    .map('output')
    .filter(group => group.songs.length > 0)
    .value()
  )
}

export default groupSongsIntoCategories
