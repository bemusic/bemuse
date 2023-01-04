import { BemusePreviewer } from './BemusePreviewer'
import React from 'react'
import _ from 'lodash'
import { sceneRoot } from 'bemuse/utils/main-element'

export function main() {
  sceneRoot.render(<BemusePreviewer />)
}
