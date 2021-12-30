import Notechart from 'bemuse-notechart'

export interface NotechartPreview {
  /**
   * Song’s length in seconds.
   */
  duration: number

  name: string
  description: string
}

export function createNullNotechartPreview(): NotechartPreview {
  return {
    duration: 0.99,
    name: 'No BMS/bmson loaded',
    description:
      'Drop a folder with BMS/bmson files into this window to preview it.',
  }
}

export function createNotechartPreview(
  notechart: Notechart,
  filename: string
): NotechartPreview {
  return new BemuseNotechartPreview(notechart, filename)
}

class BemuseNotechartPreview implements NotechartPreview {
  constructor(private _notechart: Notechart, private _filename: string) {}

  get duration() {
    return this._notechart.duration
  }

  get name() {
    return this._filename
  }

  get description() {
    return this._notechart.songInfo.title
  }
}
