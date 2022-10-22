import _ from 'lodash'
import { createHash } from 'crypto'
import { Song } from 'bemuse/collection-model/types'

const getHashFunction = _.once(() => {
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().split('T')[0]
  return _.memoize((id: string) => {
    const md5 = createHash('md5')
    md5.update(id)
    md5.update(today)
    return md5.digest('hex')
  })
})

export class SongOfTheDay {
  private ids: Set<string>
  constructor(songs: Song[], { enabled = true } = {}) {
    if (!enabled) {
      this.ids = new Set()
      return
    }

    const sorted = _.sortBy(
      songs.filter((s) => !s.custom && !s.tutorial),
      (s) => getHashFunction()(s.id)
    )
    this.ids = new Set(sorted.slice(0, 3).map((s) => s.id))
  }

  isSongOfTheDay(id: string) {
    return this.ids.has(id)
  }
}
