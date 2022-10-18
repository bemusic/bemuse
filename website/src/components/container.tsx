import React, { HTMLProps } from 'react'

import styles from './container.module.css'

const paddingClasses = {
  top: styles.paddingTop,
  bottom: styles.paddingBottom,
} as const

export type PaddingTypes = keyof typeof paddingClasses

export const Container = (
  props: HTMLProps<HTMLDivElement> & {
    padding?: PaddingTypes[]
    background?: string
  }
) => (
  <div
    {...props}
    className={`${styles.container} ${props.className} ${props.padding
      ?.map((key) => paddingClasses[key])
      .join(' ')}`}
  />
)
