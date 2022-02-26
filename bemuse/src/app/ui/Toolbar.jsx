import React from 'react'
import PropTypes from 'prop-types'
import SceneToolbar from 'bemuse/ui/SceneToolbar'
import TipContainer from 'bemuse/ui/TipContainer'
import $ from 'jquery'
import FirstTimeTip from './FirstTimeTip'
import Icon from 'react-fontawesome'
import { WindowSize } from 'react-fns'
import FloatingMobileButton from 'bemuse/ui/FloatingMobileButton'
import FloatingMobileMenu from 'bemuse/ui/FloatingMobileMenu'
import Toggle from 'react-toggled'

function Toolbar({ items }) {
  return (
    <WindowSize
      render={({ width, height }) =>
        width < 720 ? (
          <MobileToolbar items={items} />
        ) : (
          <DesktopToolbar items={items} />
        )
      }
    />
  )
}
Toolbar.propTypes = {
  items: PropTypes.array,
}

const defaultOptions = {
  href: 'javascript://bemuse.ninja',
  onClick: openLink,
}

Toolbar.item = (text, options) => {
  return {
    type: 'item',
    text,
    ...defaultOptions,
    ...options,
  }
}
Toolbar.spacer = () => {
  return { type: 'spacer' }
}

class DesktopToolbar extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }
  render() {
    return (
      <SceneToolbar>
        {this.props.items.map((element, index) => {
          if (element.type === 'item') {
            return (
              <React.Fragment key={index}>
                {this.renderItem(element)}
              </React.Fragment>
            )
          } else {
            return (
              <React.Fragment key={index}>{this.renderSpacer()}</React.Fragment>
            )
          }
        })}
      </SceneToolbar>
    )
  }
  renderItem(item) {
    let content = item.text
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
      <a onClick={item.onClick} href={item.href}>
        {content}
      </a>
    )
  }
  renderSpacer() {
    return <SceneToolbar.Spacer />
  }
}

class MobileToolbar extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }
  render() {
    return (
      <Toggle>
        {({ on, getTogglerProps }) => (
          <React.Fragment>
            <FloatingMobileMenu visible={on}>
              {this.props.items.map((element, index) => {
                if (element.type === 'item') {
                  return (
                    <React.Fragment key={index}>
                      {this.renderItem(element)}
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={index}>
                      {this.renderSeparator()}
                    </React.Fragment>
                  )
                }
              })}
            </FloatingMobileMenu>
            <FloatingMobileButton buttonProps={getTogglerProps()}>
              <Icon name='bars' />
            </FloatingMobileButton>
          </React.Fragment>
        )}
      </Toggle>
    )
  }
  renderItem(item) {
    return (
      <a onClick={item.onClick} href={item.href}>
        {item.text}
      </a>
    )
  }
  renderSeparator() {
    return <FloatingMobileMenu.Separator />
  }
}

function openLink(e) {
  e.preventDefault()
  window.open($(e.target).closest('a').get(0).href, '_blank')
}

export default Toolbar
