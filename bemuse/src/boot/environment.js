import 'jquery'
import 'bemuse/bootstrap'
import FastClick from 'fastclick'
import React from 'react'

window.React = React
// fastclick's CJS module.exports IS the `attach` function, with the class
// exposed as `.FastClick`. Handle both interop shapes.
const fastClickAttach =
  (FastClick && FastClick.FastClick && FastClick.FastClick.attach) ||
  FastClick.attach ||
  FastClick
fastClickAttach(document.body)
