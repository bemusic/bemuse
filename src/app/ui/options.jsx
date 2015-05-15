import './options.scss'
import React        from 'react'
import Panel          from 'bemuse/ui/panel'
import OptionsPlayer  from './options-player'
import OptionsInput   from './options-input'

export default React.createClass({
  render() {
    return <div className="options">
      <Panel title="Player Settings">
        <OptionsPlayer
            onClose={this.props.onClose} />
      </Panel>
      <div className="options--vgroup">
        <Panel title="Input Settings">
          <OptionsInput />
        </Panel>
        <Panel title="Advanced Settings">
          <div style={{
              padding: '10px', textAlign: 'center', color: '#8b8685' }}>
            (coming soon)
          </div>
        </Panel>
      </div>
    </div>
  }
})
