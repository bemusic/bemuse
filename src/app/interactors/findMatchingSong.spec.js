import assert from 'power-assert'

import findMatchingSong from './findMatchingSong'

describe('selecting a song by title', function () {
  // Using &song=... URL parameter, we can specify what song to be selected
  // at the beginning…
  const songs = [ 'DE/CON-STRUKT', 'Everyday evermore', 'Chicken', 'Piece of Mine', 'Goliath' ]
  const getTitle = (song) => song

  it('finds a matching song', () => {
    assert(findMatchingSong({ songs, getTitle, title: 'DE/CON-STRUKT' }) === 'DE/CON-STRUKT')
  })

  it('matches case-insensitively', () => {
    assert(findMatchingSong({ songs, getTitle, title: 'everyday evermore' }) === 'Everyday evermore')
  })
})
