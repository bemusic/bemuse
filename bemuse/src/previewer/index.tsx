import React from 'react'
import _ from 'lodash'
import MAIN from 'bemuse/utils/main-element'
import ReactDOM from 'react-dom'
import { BemusePreviewer } from './BemusePreviewer'

export function main() {
  ReactDOM.render(<BemusePreviewer />, MAIN)
}
