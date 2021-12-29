import React, { useEffect, useMemo } from 'react'

const noteSize = {
  s: 61,
  b: 26,
  g: 26,
  w: 34,
}

export const PreviewCanvas: React.FC<{}> = () => {
  const keymap = '16s 11 12b 13 14g 15 18b 19 - 21 22b 23 24g 25 28b 29 26s'
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const widths = useMemo(() => {
    return keymap.split(' ').map((c) => {
      if (c.endsWith('s')) return noteSize.s
      if (c.endsWith('b')) return noteSize.b
      if (c.endsWith('g')) return noteSize.g
      if (c === '-') return 72
      return noteSize.w
    })
  }, [keymap])
  const width = widths.reduce((a, b) => a + 1 + b, 1)
  const height = 550
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // background
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    // lines
    ctx.fillStyle = '#555'
    let x = 0
    for (const w of widths) {
      ctx.fillRect(x, 0, 1, height)
      x += w + 1
    }
    ctx.fillRect(x, 0, 1, height)
  }, [width, height, widths])
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        imageRendering: 'pixelated',
      }}
    />
  )
}
