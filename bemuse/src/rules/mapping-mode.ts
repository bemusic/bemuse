// Key mapping

export const MAPPING_MODES = ['KB', 'BM'] as const
export const isMappingMode = (str: string): str is MappingMode =>
  (MAPPING_MODES as readonly string[]).includes(str)
export type MappingMode = typeof MAPPING_MODES[number]
