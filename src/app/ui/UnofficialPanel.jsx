import './UnofficialPanel.scss'

import DialogContent from 'bemuse/ui/DialogContent'
import Panel from 'bemuse/ui/Panel'
import PropTypes from 'prop-types'
import React from 'react'

import OptionsButton from './OptionsButton'

class UnofficialPanel extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired
  }

  render () {
    return (
      <div style={{ maxWidth: '30em' }}>
        <Panel title='Unofficial Music Server'>
          <DialogContent>
            <p>
              You are now playing in an <strong>unofficial music server</strong>.
              This music server is not maintained or endorsed by Bemuse or
              Bemuse’s developers.
            </p>
            <DialogContent.Buttons>
              <OptionsButton onClick={this.props.onClose}>Close</OptionsButton>
            </DialogContent.Buttons>
          </DialogContent>
        </Panel>
      </div>
    )
  }
}

export default UnofficialPanel
