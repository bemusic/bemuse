import * as MusicPreviewer from 'bemuse/music-previewer'
import MAIN from 'bemuse/utils/main-element'
import React from 'react'
import { render } from 'react-dom'

import CollectionViewer from './CollectionViewer'

export function main () {
  MusicPreviewer.preload()
  render(<CollectionViewer />, MAIN)
}
