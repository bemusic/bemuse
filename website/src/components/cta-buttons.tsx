import React, { HTMLAttributeAnchorTarget, ReactNode } from 'react'
import { docUrl, pageUrl } from '../lib/url'

import styles from './cta-buttons.module.css'

const Button = ({
  href,
  target = '_self',
  rel,
  children,
  isHighlight = false,
}: {
  href: string
  target?: HTMLAttributeAnchorTarget
  rel?: string
  children: ReactNode
  isHighlight?: boolean
}) => (
  <a
    className={styles.button}
    href={href}
    target={target}
    rel={rel}
    data-highlight={isHighlight}
  >
    {children}
  </a>
)

const PromoSection = ({ children }: { children: ReactNode }) => (
  <div className={styles.promoSection}>
    <div className={styles.promoRow}>
      <div className={styles.pluginRowBlock}>{children}</div>
    </div>
  </div>
)

export const CTAButtons = ({
  language,
  isHighlight,
}: {
  language?: string
  isHighlight?: boolean
}) => (
  <PromoSection>
    <Button
      href='https://bemuse.ninja'
      target='blank'
      rel='noopener noreferrer'
      isHighlight={isHighlight}
    >
      Play Now
    </Button>
    <Button
      href={docUrl('user-guide.html', language)}
      isHighlight={isHighlight}
    >
      Read the Docs
    </Button>
    <Button
      href={pageUrl('contribute.html', language)}
      isHighlight={isHighlight}
    >
      Contribute
    </Button>
  </PromoSection>
)
