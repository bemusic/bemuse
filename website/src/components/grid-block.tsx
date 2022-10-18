import React, { HTMLProps, ReactNode } from 'react'

import styles from './grid-block.module.css'

export const GridBlock = (
  props: HTMLProps<HTMLDivElement> & {
    contents: { title: string; content: ReactNode }[]
    layout: string
  }
) => (
  <div className={styles.gridBlock} {...props}>
    {props.contents.map(({ title, content }) => (
      <div key={title} className={styles.blockElement}>
        <h2 className={styles.title}>{title}</h2>
        <div>{content}</div>
      </div>
    ))}
  </div>
)
