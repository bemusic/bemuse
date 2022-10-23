import './BarDot.scss'
import React from 'react'

export interface BarDot {
  fraction: number
  fill: string
}

export const BarDot: FC<BarDot> = (props) => (
  <svg width={32} height={32} viewBox='0 0 32 32' className='BarDot'>
    {props.fraction > 0 ? (
      props.fraction < 0.99 ? (
        <path
          fill={props.fill}
          d={describeArc(16, 16, 16, 0, props.fraction * 360)}
        />
      ) : (
        <circle cx={16} cy={16} r={16} fill={props.fill} />
      )
    ) : null}
  </svg>
)

// Yoinked from StackOverflow: https://stackoverflow.com/a/18473154/559913
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

// Yoinked from StackOverflow: https://stackoverflow.com/a/18473154/559913
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  const d = [
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
