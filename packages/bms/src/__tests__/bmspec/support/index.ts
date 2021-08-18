import {
  BMSChart,
  BMSNote,
  BMSObject,
  Compiler,
  Keysounds,
  Notes,
  Positioning,
  SongInfo,
  Spacing,
  Timing,
} from '../../..'

import { BMSCompileOptions } from '../../../compiler'

declare global {
  interface ICucumberWorld {
    parseBMS: (bms: string) => void
    chart: BMSChart
    keysounds: Keysounds
    notes: Notes
    positioning: Positioning
    songInfo: SongInfo
    spacing: Spacing
    timing: Timing

    getNote: (value: string) => BMSNote
    getObject: (value: string) => BMSObject

    parseOptions: BMSCompileOptions
    result: ReturnType<typeof Compiler.compile>
  }
}

export {}
