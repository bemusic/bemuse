
import './unofficial-panel.scss'
import React from 'react'
import Panel from 'bemuse/ui/panel'
import OptionsButton from './options-button'

export default React.createClass({
  render() {
    return <div className="unofficial-panel">
      <Panel title='Unofficial Music Server'>
        <div className="unofficial-panel--content">
          <p>
            You are now playing in an <strong>unofficial music server</strong>.
            This music server is not maintained or endorsed by Bemuse or
            Bemuse’s developers.
          </p>
          <p className="unofficial-panel--buttons">
            <OptionsButton onClick={this.props.onClose}>Close</OptionsButton>
          </p>
        </div>
      </Panel>
    </div>
  }
})
