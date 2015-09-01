import './options.scss'
import React            from 'react'
import Panel            from 'bemuse/ui/panel'
import OptionsPlayer    from './options-player'
import OptionsInput     from './options-input'
import OptionsAdvanced  from './options-advanced'

export default React.createClass({
  render() {
    return <div className="Options">
      <Panel title="Player Settings">
        <OptionsPlayer
            onClose={this.props.onClose} />
      </Panel>
      <div className="Optionsのvgroup">
        <Panel title="Input Settings">
          <OptionsInput />
        </Panel>
        <Panel title="Advanced Settings">
          <OptionsAdvanced />
        </Panel>
      </div>
    </div>
  }
})
