import './OptionsPlayerGraphics.scss'

import * as touch3d from 'bemuse/game/display/touch3d'

import React from 'react'
import c from 'classnames'

const PANEL_PATH = (function () {
  const x = 48
  const w = 14
  const y = 20
  const p = 3
  const x1 = x + w
  const x2 = x + w + p
  const x3 = x - w
  const x4 = x - w - p
  const y1 = -2
  const y2 = y
  const y3 = y + p
  const y4 = 56
  return `M${x1} ${y1} L${x1} ${y2} L${x2} ${y3} L${x2} ${y4}
          L${x4} ${y4} L${x4} ${y3} L${x3} ${y2} L${x3} ${y1}`
})()

const PANEL_3D_PATH = (function () {
  const down = []
  const up = []
  for (let i = 0; i <= 11; i++) {
    const row = touch3d.getRow(i / 10)
    const y = row.y * 0.075
    const dx = touch3d.PLAY_AREA_WIDTH * row.projection * 0.075
    down.push(`${i === 0 ? 'M' : 'L'}${48 - dx} ${y}`)
    up.push(`L${48 + dx} ${y}`)
  }
  return [...down, ...up.reverse()].join(' ')
})()

const Scratch = ({ value }: { value: string }) => {
  const p = value
  const bx = p === 'left' ? 24 : p === 'right' ? 4 : 14
  const gx = p === 'left' ? 21 : p === 'right' ? 75 : null
  const sx = p === 'left' ? 11 : p === 'right' ? 85 : null
  const off = value === 'off'
  return (
    <svg width='96' height='54'>
      <g transform={'translate(' + bx + ' 32)'}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            className='OptionsPlayerGraphicsのline'
            x={off && i === 3 ? 10 : i * 10}
            y={off ? (i === 3 ? 10 : 0) : (1 - (i % 2)) * 3}
            width={off && i === 3 ? 48 : 8}
            height={off ? 8 : 16}
            rx={2}
            ry={2}
          />
        ))}
      </g>
      {sx && (
        <circle
          className='OptionsPlayerGraphicsのline'
          cx={sx}
          cy='42'
          r='8'
          style={{ fill: 'rgba(255,255,255,0.1)' }}
        />
      )}
      {gx && (
        <line
          className='OptionsPlayerGraphicsのline'
          x1={gx}
          x2={gx}
          y1='1'
          y2='53'
        />
      )}
      <line
        className='OptionsPlayerGraphicsのline'
        x1='1'
        x2='95'
        y1='29'
        y2='29'
      />
    </svg>
  )
}

const Panel = ({ value }: { value: string }) => {
  const p = value
  const tx = p === 'left' ? -35 : p === 'right' ? 35 : 0
  return (
    <svg width='96' height='54'>
      {p === '3d' ? (
        <path
          className='OptionsPlayerGraphicsのline'
          d={PANEL_3D_PATH}
          style={{ fill: 'rgba(255,255,255,0.1)' }}
        />
      ) : (
        <g transform={'translate(' + tx + ' 0)'}>
          <path
            className='OptionsPlayerGraphicsのline'
            d={PANEL_PATH}
            style={{ fill: 'rgba(255,255,255,0.1)' }}
          />
        </g>
      )}
    </svg>
  )
}

export interface OptionsPlayerGraphicsProps<T extends string> {
  type: string
  active: boolean
  value: T
}

const OptionsPlayerGraphics = <T extends string>({
  type,
  active,
  value,
}: OptionsPlayerGraphicsProps<T>) => {
  const svg =
    type === 'scratch' ? <Scratch value={value} /> : <Panel value={value} />
  return (
    <div
      className={c('OptionsPlayerGraphics', {
        'is-active': active,
      })}
    >
      {svg}
    </div>
  )
}

export default OptionsPlayerGraphics
