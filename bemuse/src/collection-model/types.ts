/* eslint camelcase: off */
/* REASON: These snake case names are used in our JSON files. */

import { IResources } from 'bemuse/resources/types'
import type { Chart, SongMetadataInCollection } from 'bemuse-types'

export interface Song extends SongMetadataInCollection {
  /** Resources that loaded the song file. Added by Bemuse at runtime. */
  resources?: IResources

  /** `true` if this is loaded from a custom song. */
  custom?: boolean

  /** `true` if this is an unreleased song. */
  unreleased?: boolean
}

export type { Chart }
