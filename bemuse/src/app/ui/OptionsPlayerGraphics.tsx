import './OptionsPlayerGraphics.scss'

import * as touch3d from 'bemuse/game/display/touch3d'

import { PanelPlacement, ScratchPosition } from '../entities/Options'
import React, { ReactNode } from 'react'

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
  up.reverse()
  return [...down, ...up].join(' ')
})()

export const Scratch = ({
  active,
  value,
}: {
  active: boolean
  value: ScratchPosition
}) => {
  interface Transform {
    bx: number
    gx: number | null
    sx: number | null
  }
  const transforms: Record<ScratchPosition, Transform> = {
    left: {
      bx: 24,
      gx: 21,
      sx: 11,
    },
    right: {
      bx: 4,
      gx: 75,
      sx: 85,
    },
    off: {
      bx: 14,
      gx: null,
      sx: null,
    },
  }
  const { bx, gx, sx } = transforms[value]
  const off = value === 'off'

  interface Rect {
    x: number
    y: number
    width: number
    height: number
  }
  const linesRect = (i: number): Rect => {
    if (off) {
      return {
        x: i === 3 ? 10 : i * 10,
        y: i === 3 ? 10 : 0,
        width: i === 3 ? 48 : 8,
        height: 8,
      }
    }
    return {
      x: i * 10,
      y: (1 - (i % 2)) * 3,
      width: 8,
      height: 16,
    }
  }
  return (
    <OptionsPlayerGraphicsContainer active={active}>
      <g transform={'translate(' + bx + ' 32)'}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const rect = linesRect(i)
          return (
            <rect
              key={i}
              className='OptionsPlayerGraphicsのline'
              {...rect}
              rx={2}
              ry={2}
            />
          )
        })}
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
    </OptionsPlayerGraphicsContainer>
  )
}

export const Panel = ({
  active,
  value,
}: {
  active: boolean
  value: PanelPlacement
}) => {
  const translates: Record<PanelPlacement, number> = {
    left: -35,
    right: 35,
    center: 0,
    '3d': 0,
  }
  const tx = translates[value]
  return (
    <OptionsPlayerGraphicsContainer active={active}>
      {value === '3d' ? (
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
    </OptionsPlayerGraphicsContainer>
  )
}

const OptionsPlayerGraphicsContainer = ({
  active,
  children,
}: {
  active: boolean
  children: ReactNode
}) => {
  return (
    <div
      className={c('OptionsPlayerGraphics', {
        'is-active': active,
      })}
    >
      <svg width='96' height='54'>
        {children}
      </svg>
    </div>
  )
}
