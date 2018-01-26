import DialogContent from 'bemuse/ui/DialogContent'
import ModalPopup from 'bemuse/ui/ModalPopup'
import Panel from 'bemuse/ui/Panel'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import * as ReduxState from '../redux/ReduxState'
import OptionsButton from './OptionsButton'

const enhance = connect(
  state => ({
    visible: ReduxState.selectRageQuittedFlag(state)
  }),
  dispatch => ({
    onClose: () => dispatch({ type: ReduxState.RAGEQUIT_DISMISSED })
  })
)

function RageQuitPopup ({ onClose, visible }) {
  return (
    <ModalPopup
      visible={visible}
      onBackdropClick={onClose}
    >
      <div style={{ maxWidth: '30em' }}>
        <Panel title='You just rage-quitted!'>
          <DialogContent>
            <p>
              I hope you enjoyed the tutorial ^_^
            </p>
            <p>
              From here, you can play other songs.
              Start from Level 1 and work your way up.
              And hopefully, someday, you will be able to beat this tutorial!
            </p>
            <DialogContent.Buttons>
              <OptionsButton onClick={onClose}>Continue</OptionsButton>
            </DialogContent.Buttons>
          </DialogContent>
        </Panel>
      </div>
    </ModalPopup>
  )
}

RageQuitPopup.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired
}

export default enhance(RageQuitPopup)
