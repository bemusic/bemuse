import query from 'bemuse/utils/query'

let flagSet: Set<string> | undefined

/**
 * The `?flags` parameter allows enabling experimental features by specifying a comma-separated list of flags.
 */
export function isQueryFlagEnabled(flagName: string) {
  if (!flagSet) {
    flagSet = new Set(
      String(query.flags || '')
        .split(',')
        .filter(Boolean)
    )
  }
  return flagSet.has(flagName)
}
