import React from 'react'
import PropTypes from 'prop-types'
import SceneToolbar from 'bemuse/ui/SceneToolbar'
import TipContainer from 'bemuse/ui/TipContainer'
import $ from 'jquery'
import FirstTimeTip from './FirstTimeTip'
import Icon from 'react-fa'
import { WindowSize } from 'react-fns'

function Toolbar ({ items }) {
  return (
    <WindowSize
      render={({ width, height }) => (
        width < 720
          ? <MobileToolbar items={items} />
          : <DesktopToolbar items={items} />
      )}
    />
  )
}

const defaultOptions = {
  href: 'javascript://bemuse.ninja',
  onClick: openLink
}

Toolbar.item = (text, options) => {
  return {
    type: 'item',
    text,
    ...defaultOptions,
    ...options
  }
}
Toolbar.spacer = () => {
  return { type: 'spacer' }
}

class DesktopToolbar extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired
  }
  render () {
    return (
      <SceneToolbar>
        {this.props.items.map(element => {
          if (element.type === 'item') {
            return this.renderItem(element)
          } else {
            return this.renderSpacer()
          }
        })}
      </SceneToolbar>
    )
  }
  renderItem (item) {
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
  renderSpacer () {
    return <SceneToolbar.Spacer />
  }
}

class MobileToolbar extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired
  }
  render () {
    void this.props.items
    return (
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          width: 40,
          height: 40,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}
        onClick={() => window.alert('Mobile toolbar is not working yet ^_^')}
      >
        <Icon name='bars' />
      </div>
    )
  }
}

function openLink (e) {
  e.preventDefault()
  window.open(
    $(e.target)
      .closest('a')
      .get(0).href,
    '_blank'
  )
}

export default Toolbar
