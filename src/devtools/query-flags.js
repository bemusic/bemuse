
import query from 'bemuse/utils/query'

export function shouldShowOptions() {
  return query.BEMUSE_SHOW_OPTIONS === '1'
}
