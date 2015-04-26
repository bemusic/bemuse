import './options.scss'
import React        from 'react'
import OptionsPanel   from './options-panel'
import OptionsPlayer  from './options-player'
import OptionsInput   from './options-input'

export default React.createClass({
  render() {
    return <div className="options">
      <OptionsPanel title="Player Settings">
        <OptionsPlayer />
      </OptionsPanel>
      <div className="options--vgroup">
        <OptionsPanel title="Input Settings">
          <OptionsInput />
        </OptionsPanel>
        <OptionsPanel title="Advanced Settings">
          Wow
        </OptionsPanel>
      </div>
    </div>
  }
})
