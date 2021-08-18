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
import { expect } from 'chai'
import once from 'lodash.once'

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

    parseOptions: Partial<BMSCompileOptions>
    result: ReturnType<typeof Compiler.compile>
  }
}

export class World implements ICucumberWorld {
  parseOptions: Partial<BMSCompileOptions> = {}
  source!: string
  result!: ReturnType<typeof Compiler.compile>
  chart!: BMSChart

  parseBMS(string: string) {
    this.source = string
    this.result = Compiler.compile(this.source, this.parseOptions)
    this.chart = this.result.chart
  }

  getObject(value: string) {
    var matching = this.chart.objects.all().filter(function (object) {
      return object.value === value
    })
    expect(matching).to.have.length(1, 'getObject(' + value + ')')
    return matching[0]
  }

  getNote(value: string) {
    var matching = this.notes.all().filter(function (object) {
      return object.keysound === value
    })
    expect(matching).to.have.length(1, 'getNote(' + value + ')')
    return matching[0]
  }

  private _keysounds = once(() => Keysounds.fromBMSChart(this.chart))
  private _notes = once(() => Notes.fromBMSChart(this.chart))
  private _positioning = once(() => Positioning.fromBMSChart(this.chart))
  private _songInfo = once(() => SongInfo.fromBMSChart(this.chart))
  private _spacing = once(() => Spacing.fromBMSChart(this.chart))
  private _timing = once(() => Timing.fromBMSChart(this.chart))

  get keysounds() {
    return this._keysounds()
  }
  get notes() {
    return this._notes()
  }
  get positioning() {
    return this._positioning()
  }
  get songInfo() {
    return this._songInfo()
  }
  get spacing() {
    return this._spacing()
  }
  get timing() {
    return this._timing()
  }
}
