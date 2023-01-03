import FloatingMobileMenu, {
  FloatingMobileMenuSeparator,
} from 'bemuse/ui/FloatingMobileMenu'
import React, { MouseEvent, memo, useState } from 'react'
import SceneToolbar, { SceneToolbarSpacer } from 'bemuse/ui/SceneToolbar'

import FirstTimeTip from './FirstTimeTip'
import FloatingMobileButton from 'bemuse/ui/FloatingMobileButton'
import { Icon } from 'bemuse/fa'
import TipContainer from 'bemuse/ui/TipContainer'
import { WindowSize } from 'react-fns'

export interface ToolbarItem {
  type: 'item'
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void
  href?: string
  text: ReactNode
  tip?: ReactNode
  tipFeatureKey?: string
  tipVisible?: boolean
}

export interface ToolbarSpacer {
  type: 'spacer'
}

export type ToolbarItems = readonly (ToolbarItem | ToolbarSpacer)[]

function Toolbar({ items }: { items: ToolbarItems }) {
  return (
    <WindowSize
      render={({ width }) =>
        width < 720 ? (
          <MobileToolbar items={items} />
        ) : (
          <DesktopToolbar items={items} />
        )
      }
    />
  )
}

function openLink(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  window.open(e.currentTarget.href, '_blank')
}
const defaultOptions = {
  onClick: openLink,
} as const

Toolbar.item = (
  text: ReactNode,
  options: Partial<ToolbarItem>
): ToolbarItem => {
  return {
    type: 'item',
    text,
    ...defaultOptions,
    ...options,
  }
}
Toolbar.spacer = (): ToolbarSpacer => {
  return { type: 'spacer' }
}

const DesktopToolbarItem = ({ item }: { item: ToolbarItem }) => {
  let content = <>{item.text}</>
  if (item.tip) {
    if (item.tipFeatureKey) {
      content = (
        <FirstTimeTip tip={item.tip} featureKey={item.tipFeatureKey}>
          {content}
        </FirstTimeTip>
      )
    } else {
      content = (
        <TipContainer tip={item.tip} tipVisible={!!item.tipVisible}>
          {content}
        </TipContainer>
      )
    }
  }
  return (
    <a onClick={item.onClick} href={item.href} style={{ cursor: 'pointer' }}>
      {content}
    </a>
  )
}

const DesktopToolbar = memo(({ items }: { items: ToolbarItems }) => (
  <SceneToolbar>
    {items.map((element, index) => {
      if (element.type === 'item') {
        return (
          <React.Fragment key={index}>
            <DesktopToolbarItem item={element} />
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment key={index}>
            <SceneToolbarSpacer />
          </React.Fragment>
        )
      }
    })}
  </SceneToolbar>
))

const MobileToolbarItem = ({ item }: { item: ToolbarItem }) => (
  <a onClick={item.onClick} href={item.href}>
    {item.text}
  </a>
)

const MobileToolbar = memo(({ items }: { items: ToolbarItems }) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <FloatingMobileMenu visible={visible}>
        {items.map((element, index) => {
          if (element.type === 'item') {
            return (
              <React.Fragment key={index}>
                <MobileToolbarItem item={element} />
              </React.Fragment>
            )
          } else {
            return (
              <React.Fragment key={index}>
                <FloatingMobileMenuSeparator />
              </React.Fragment>
            )
          }
        })}
      </FloatingMobileMenu>
      <FloatingMobileButton
        buttonProps={{ onClick: () => setVisible((flag) => !flag) }}
      >
        <Icon name='bars' />
      </FloatingMobileButton>
    </>
  )
})

export default Toolbar
