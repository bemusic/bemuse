import React, { HTMLProps, ReactNode } from 'react'

export const GridBlock = (
  props: HTMLProps<HTMLDivElement> & {
    contents: { title: string; content: ReactNode }[]
    layout: string
  }
) => (
  <div {...props}>
    {props.contents.map(({ content }) => (
      <div>{content}</div>
    ))}
  </div>
)
