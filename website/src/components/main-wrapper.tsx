import React, { ReactNode } from 'react'

import { Container } from './container'
import styles from './main-wrapper.module.css'

export const MainWrapper = ({ children }: { children: ReactNode }) => (
  <div className={styles.wrapper}>
    <Container className={styles.main}>{children}</Container>
  </div>
)
