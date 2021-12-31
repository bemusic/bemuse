import React from 'react'
import MAIN from 'bemuse/utils/main-element'
import ReactDOM from 'react-dom'
import { BarDot } from 'bemuse/previewer/BarDot'

export function main() {
  ReactDOM.render(
    <>
      <BarDot fill='white' fraction={0} />
      <BarDot fill='white' fraction={0.25} />
      <BarDot fill='white' fraction={0.5} />
      <BarDot fill='white' fraction={0.67} />
      <BarDot fill='white' fraction={0.75} />
      <BarDot fill='white' fraction={0.8} />
      <BarDot fill='white' fraction={1} />
    </>,
    MAIN
  )
}
