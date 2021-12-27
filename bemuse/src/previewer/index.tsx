import React from 'react'
import _ from 'lodash'
import MAIN from 'bemuse/utils/main-element'
import ReactDOM from 'react-dom'

const BemusePreviewer = () => {
  return (
      <h1>Bemuse BMS previewer</h1>
  )
}

export function main() {
  ReactDOM.render(
    <BemusePreviewer />,
    MAIN
  )
}
