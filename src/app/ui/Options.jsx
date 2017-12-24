import './Options.scss'
import React from 'react'
import Panel from 'bemuse/ui/Panel'
import OptionsPlayer from './OptionsPlayer'
import OptionsInput from './OptionsInput'
import OptionsAdvanced from './OptionsAdvanced'

export default class Options extends React.Component {
  render () {
    return <div className='Options'>
      <Panel title='Player Settings'>
        <OptionsPlayer
          onClose={this.props.onClose} />
      </Panel>
      <div className='Optionsのvgroup'>
        <Panel title='Input Settings'>
          <OptionsInput />
        </Panel>
        <Panel title='Advanced Settings'>
          <OptionsAdvanced />
        </Panel>
      </div>
    </div>
  }
}
