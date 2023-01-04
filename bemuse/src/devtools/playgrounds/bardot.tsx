import { BarDot } from 'bemuse/previewer/BarDot'
import React from 'react'
import { sceneRoot } from 'bemuse/utils/main-element'

export function main() {
  sceneRoot.render(
    <>
      <BarDot fill='white' fraction={0} />
      <BarDot fill='white' fraction={0.25} />
      <BarDot fill='white' fraction={0.5} />
      <BarDot fill='white' fraction={0.67} />
      <BarDot fill='white' fraction={0.75} />
      <BarDot fill='white' fraction={0.8} />
      <BarDot fill='white' fraction={1} />
    </>
  )
}
