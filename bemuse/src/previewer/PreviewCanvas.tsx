import _ from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { NotechartPreview } from './NotechartPreview'
import { PreviewState } from './PreviewState'

export type PreviewColumn = {
  x: number
  width: number
  column: string | null
  sprite?: PreviewNoteSprite
}

export type PreviewNoteSprite = {
  x: number
  width: number
  highlight?: boolean
}

const sprites = {
  scratch: { x: 0, width: 61 },
  white: { x: 62, width: 34, highlight: true },
  blue: { x: 97, width: 26 },
  green: { x: 159, width: 26 },
}

class PreviewLayout {
  columns: PreviewColumn[]
  totalWidth: number
  columnMapping: Record<string, PreviewColumn>
  constructor(keymap: string) {
    let nextX = 0
    const column = (width: number, name: string | null): PreviewColumn => {
      const x = nextX
      nextX += width + 1
      return { x, width, column: name }
    }
    const noteColumn = (
      sprite: PreviewNoteSprite,
      name: string
    ): PreviewColumn => {
      return { ...column(sprite.width, name), sprite }
    }
    this.columns = keymap.split(' ').map((c) => {
      if (c === '-') return column(72, null)
      if (c.endsWith('s')) return noteColumn(sprites.scratch, c.slice(0, -1))
      if (c.endsWith('b')) return noteColumn(sprites.blue, c.slice(0, -1))
      if (c.endsWith('g')) return noteColumn(sprites.green, c.slice(0, -1))
      return noteColumn(sprites.white, c)
    })
    this.totalWidth = nextX
    this.columnMapping = _.fromPairs(
      this.columns.filter((c) => c.column != null).map((c) => [c.column, c])
    )
  }
}

export const PreviewCanvas: React.FC<{
  previewState: PreviewState
  notechartPreview: NotechartPreview
}> = (props) => {
  const keymap = 'SCs 1 2b 3 4g 5 6b 7 - 8 9b 10 11g 12 13b 14 SC2s'
  const notesImage = useImage('/skins/default/Note/DX/Note.png')
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const layout = useMemo(() => new PreviewLayout(keymap), [keymap])
  const width = layout.totalWidth + 1
  const height = 480

  const viewport = useMemo(() => {
    return props.notechartPreview.getViewport(
      props.previewState.currentTime,
      props.previewState.hiSpeed
    )
  }, [
    props.notechartPreview,
    props.previewState.currentTime,
    props.previewState.hiSpeed,
  ])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // background
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    // lines
    for (const column of layout.columns) {
      ctx.fillStyle = '#555'
      ctx.fillRect(column.x, 0, 1, height)
      if (column.sprite?.highlight) {
        ctx.fillStyle = '#111'
        ctx.fillRect(column.x + 1, 0, column.width, height)
      }
    }
    ctx.fillStyle = '#555'
    ctx.fillRect(layout.totalWidth, 0, 1, height)

    for (const barLineY of viewport.visibleBarLines) {
      const y = Math.round(height - barLineY * height)
      ctx.fillRect(0, y - 1, layout.totalWidth, 1)
    }

    if (notesImage) {
      for (const note of viewport.visibleNotes) {
        const column = layout.columnMapping[note.gameNote.column]
        if (column?.sprite) {
          const y = Math.round(height - note.y * height)
          if (note.long) {
            const endY = Math.round(height - note.long.endY * height)
            const spriteYOffset = note.long.active ? 100 : 0
            ctx.drawImage(
              notesImage,
              column.sprite.x,
              104 + spriteYOffset,
              column.width,
              8,
              column.x + 1,
              y - 4,
              column.width,
              8
            )
            ctx.drawImage(
              notesImage,
              column.sprite.x,
              12 + spriteYOffset,
              column.width,
              8,
              column.x + 1,
              endY - 12,
              column.width,
              8
            )
            const noteHeight = y - endY
            if (noteHeight > 0) {
              ctx.drawImage(
                notesImage,
                column.sprite.x,
                22 + spriteYOffset,
                column.width,
                64,
                column.x + 1,
                endY - 4,
                column.width,
                noteHeight
              )
            }
          } else {
            ctx.drawImage(
              notesImage,
              column.sprite.x,
              0,
              column.width,
              12,
              column.x + 1,
              y - 12,
              column.width,
              12
            )
          }
        }
      }
    }
  }, [width, height, layout, viewport, notesImage])

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

function useImage(src: string) {
  const [image, setImage] = React.useState<HTMLImageElement | null>(null)
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setImage(img)
    return () => {
      img.onload = null
    }
  }, [src])
  return image
}
