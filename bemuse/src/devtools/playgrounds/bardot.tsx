import React from 'react'
import MAIN from 'bemuse/utils/main-element'
import ReactDOM from 'react-dom'

export function main() {
  ReactDOM.render(<Circ />, MAIN)
}

const Circ = () => (
  <svg width={32} height={32} viewBox='0 0 32 32'>
    <path fill='red' d={describeArc(16, 16, 16, 0, 240)} />
  </svg>
)

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  var start = polarToCartesian(x, y, radius, endAngle)
  var end = polarToCartesian(x, y, radius, startAngle)

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  var d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'L',
    x,
    y,
  ].join(' ')

  return d
}
