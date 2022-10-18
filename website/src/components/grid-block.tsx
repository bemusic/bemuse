import React, { HTMLProps } from 'react'

export const GridBlock = (
  props: HTMLProps<HTMLDivElement> & {
    contents: { title: string; content: string }[]
    layout: string
  }
) => <div {...props}></div>
