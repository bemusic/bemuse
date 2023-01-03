import './UnofficialPanel.scss'

import DialogContent, { Buttons } from 'bemuse/ui/DialogContent'

import OptionsButton from './OptionsButton'
import Panel from 'bemuse/ui/Panel'
import React from 'react'

export interface UnofficialPanelProps {
  onClose: () => void
}

const UnofficialPanel = ({ onClose }: UnofficialPanelProps) => (
  <div style={{ maxWidth: '30em' }}>
    <Panel title='Unofficial Music Server'>
      <DialogContent>
        <p>
          You are now playing in an <strong>unofficial music server</strong>.
          This music server is not maintained or endorsed by Bemuse or Bemuse’s
          developers.
        </p>
        <Buttons>
          <OptionsButton onClick={onClose}>Close</OptionsButton>
        </Buttons>
      </DialogContent>
    </Panel>
  </div>
)

export default UnofficialPanel
