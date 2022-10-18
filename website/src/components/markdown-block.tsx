import React, { HTMLProps } from 'react'

export const MarkdownBlock = (
  props: Omit<HTMLProps<HTMLDivElement>, 'className'>
) => <div className='markdown' {...props}></div>
