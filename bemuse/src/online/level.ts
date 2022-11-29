import { MappingMode, isMappingMode } from 'bemuse/app/entities/Options'

import invariant from 'invariant'

export interface RecordLevel {
  md5: string
  playMode: MappingMode
}

export function fromObject({
  md5,
  playMode,
}: {
  md5?: unknown
  playMode?: unknown
}): RecordLevel {
  invariant(typeof md5 === 'string', 'md5 must be a string')
  invariant(typeof playMode === 'string', 'playMode must be a string')
  invariant(isMappingMode(playMode), 'playMode must be a MappingMode')
  return { md5, playMode }
}
