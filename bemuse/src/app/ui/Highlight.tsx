import React from 'react'

export const Highlight = ({
  text,
  highlight,
}: {
  text: string
  highlight?: string
}) => {
  if (!highlight) return <>{text}</>
  const segments = text.toLowerCase().split(highlight.toLowerCase())
  if (segments.length === 1) return <>{text}</>
  const output = []
  let start = 0
  for (let i = 0; i < segments.length; i++) {
    output.push(text.substring(start, start + segments[i].length))
    start += segments[i].length
    if (i !== segments.length - 1) {
      const highlightedText = text.substring(start, start + highlight.length)
      output.push(
        <span key={start} className='MusicListItemのhighlight'>
          {highlightedText}
        </span>
      )
      start += highlight.length
    }
  }
  return <>{output}</>
}
