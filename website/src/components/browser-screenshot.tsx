import React from 'react'
import styles from './browser-screenshot.module.css'

export const BrowserScreenshot = (props: { alt: string; src: string }) => (
  <div className={styles.browserScreenshot}>
    <p>
      <img {...props} />
    </p>
  </div>
)
