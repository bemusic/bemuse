import React, { ReactNode } from 'react'

import styles from './post.module.css'

export const Post = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div className={styles.post}>
    <header className={styles.postHeader}>
      <h1 className={styles.postHeaderTitle}>{title}</h1>
    </header>
    {children}
  </div>
)
