
import query from 'bemuse/utils/query'

export function getMusicServer () {
  return query.BEMUSE_MUSIC_SERVER || query.server
}

export function getTimeSynchroServer () {
  return query.BEMUSE_TIMESYNCHRO_SERVER
}
