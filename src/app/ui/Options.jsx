import './Options.scss'
import React from 'react'
import PropTypes from 'prop-types'
import Panel from 'bemuse/ui/Panel'
import OptionsPlayer from './OptionsPlayer'
import OptionsInput from './OptionsInput'
import OptionsAdvanced from './OptionsAdvanced'

export default class Options extends React.Component {
  static propTypes = {
    onClose: PropTypes.func
  }

  render () {
    return (
      <div className='Options'>
        <Panel title='Player Settings'>
          <OptionsPlayer onClose={this.props.onClose} />
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
    )
  }
}
