import React, { ReactNode } from 'react'

import { Container } from './container'
import styles from './feature-block.module.css'

export const FeatureBlock = ({
  id,
  className,
  title,
  image,
  imageAlign,
  children,
}: {
  id?: string
  className?: string
  title: string
  image: ReactNode
  imageAlign: string
  children: ReactNode
}) => (
  <Container className={className} padding={['bottom', 'top']} id={id}>
    <div className={styles.wrapper}>
      <div className={styles.featureBlock} data-image-align={imageAlign}>
        <div className={styles.featureBlockContent}>
          <h2>{title}</h2>
          {children}
        </div>
        <div className={styles.featureBlockImage}>{image}</div>
      </div>
    </div>
  </Container>
)
