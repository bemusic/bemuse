import './options.scss'
import React        from 'react'
import OptionsPanel   from './options-panel'
import OptionsPlayer  from './options-player'
import OptionsInput   from './options-input'

export default React.createClass({
  render() {
    return <div className="options">
      <OptionsPanel title="Player Settings">
        <OptionsPlayer
            onClose={this.props.onClose} />
      </OptionsPanel>
      <div className="options--vgroup">
        <OptionsPanel title="Input Settings">
          <OptionsInput />
        </OptionsPanel>
        <OptionsPanel title="Advanced Settings">
          <div style={{
              padding: '10px', textAlign: 'center', color: '#8b8685' }}>
            (coming soon)
          </div>
        </OptionsPanel>
      </div>
    </div>
  }
})
