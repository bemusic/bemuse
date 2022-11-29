import * as ReduxState from '../redux/ReduxState'

import DialogContent, { Buttons } from 'bemuse/ui/DialogContent'
import { useDispatch, useSelector } from 'react-redux'

import ModalPopup from 'bemuse/ui/ModalPopup'
import OptionsButton from './OptionsButton'
import Panel from 'bemuse/ui/Panel'
import React from 'react'

function RageQuitPopup() {
  const dispatch = useDispatch()
  const visible = useSelector(ReduxState.selectRageQuittedFlag)
  const onClose = () =>
    dispatch(ReduxState.rageQuitSlice.actions.RAGEQUIT_DISMISSED())

  return (
    <ModalPopup visible={visible} onBackdropClick={onClose}>
      <div style={{ maxWidth: '30em' }}>
        <Panel title='You just rage-quitted!'>
          <DialogContent>
            <p>I hope you enjoyed the tutorial ^_^</p>
            <p>
              From here, you can play other songs. Start from Level 1 and work
              your way up. And hopefully, someday, you will be able to beat this
              tutorial!
            </p>
            <Buttons>
              <OptionsButton onClick={onClose}>Continue</OptionsButton>
            </Buttons>
          </DialogContent>
        </Panel>
      </div>
    </ModalPopup>
  )
}

export default RageQuitPopup
