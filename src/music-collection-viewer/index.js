import CollectionViewer from './CollectionViewer'
import MAIN from 'bemuse/utils/main-element'
import React from 'react'
import { render } from 'react-dom'

export function main () {
  render(<CollectionViewer />, MAIN)
}
