import './Options.scss'

import OptionsAdvanced from './OptionsAdvanced'
import OptionsInput from './OptionsInput'
import OptionsPlayer from './OptionsPlayer'
import Panel from 'bemuse/ui/Panel'
import React from 'react'

export interface OptionsProps {
  onClose?: () => void
}

const Options = ({ onClose }: OptionsProps) => (
  <div className='Options'>
    <div className='Optionsのa'>
      <Panel title='Player Settings'>
        <OptionsPlayer onClose={onClose} />
      </Panel>
    </div>
    <div className='Optionsのb'>
      <Panel title='Input Settings'>
        <OptionsInput />
      </Panel>
      <Panel title='Advanced Settings'>
        <OptionsAdvanced />
      </Panel>
    </div>
  </div>
)

export default Options
