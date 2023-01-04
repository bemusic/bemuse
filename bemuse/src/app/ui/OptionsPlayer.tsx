import './OptionsPlayer.scss'

import {
  OptionsState,
  isAutoVelocityEnabled,
  isBackgroundAnimationsEnabled,
  isGaugeEnabled,
  isPreviewEnabled,
  laneCover,
  leadTime,
  optionsSlice,
  panelPlacement,
  scratchPosition,
  speed,
} from '../entities/Options'
import { Panel, Scratch } from './OptionsPlayerGraphics'
import { useDispatch, useSelector } from 'react-redux'

import OptionsButton from './OptionsButton'
import OptionsCheckbox from './OptionsCheckbox'
import OptionsInputField from './OptionsInputField'
import { OptionsPlayerSelector } from './OptionsPlayerSelector'
import OptionsSpeed from './OptionsSpeed'
import React from 'react'
import { selectOptions } from '../redux/ReduxState'

interface SettingRowProps {
  label: string
  isVisible?: (options: OptionsState) => boolean
  renderControl: (options: OptionsState) => JSX.Element
  help?: ReactNode
}

const SettingRow = ({
  label,
  isVisible,
  help,
  renderControl,
}: SettingRowProps) => {
  const options = useSelector(selectOptions)
  const visible = isVisible ? isVisible(options) : true
  const control = renderControl(options)
  return (
    <OptionsPlayer.Row label={label} hidden={!visible}>
      {control}
      {!!help && <div className='OptionsPlayerのhelp'>{help}</div>}
    </OptionsPlayer.Row>
  )
}

const OptionsPlayer = ({ onClose }: { onClose?: () => void }) => {
  const dispatch = useDispatch()

  return (
    <div className='OptionsPlayer'>
      <SettingRow
        label='Speed'
        isVisible={(options) => !isAutoVelocityEnabled(options)}
        renderControl={(options) => (
          <OptionsSpeed
            value={speed(options)}
            onChange={(speed) =>
              dispatch(optionsSlice.actions.CHANGE_SPEED({ speed }))
            }
          />
        )}
        help={
          <span>
            You can also change the speed in-game
            <br />
            using the Up and Down arrow keys.
          </span>
        }
      />

      <SettingRow
        label='LeadTime'
        isVisible={(options) => isAutoVelocityEnabled(options)}
        renderControl={(options) => (
          <OptionsInputField
            parse={(str) => parseInt(str, 10)}
            stringify={(value) => String(value) + 'ms'}
            validator={/^\d+(ms)?$/}
            value={leadTime(options)}
            onChange={(leadTime) =>
              dispatch(optionsSlice.actions.CHANGE_LEAD_TIME({ leadTime }))
            }
            style={{ width: '5em' }}
          />
        )}
        help={
          <span>
            Speed will be automatically adjusted
            <br />
            to maintain a consistent note velocity.
          </span>
        }
      />

      <SettingRow
        label='Scratch'
        renderControl={(options) => (
          <OptionsPlayerSelector
            options={[
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
              { value: 'off', label: 'Disabled' },
            ]}
            defaultValue={scratchPosition(options)}
            onSelect={(position) =>
              dispatch(
                optionsSlice.actions.CHANGE_SCRATCH_POSITION({ position })
              )
            }
            Item={Scratch}
          />
        )}
      />

      <SettingRow
        label='Panel'
        renderControl={(options) => (
          <OptionsPlayerSelector
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: '3d', label: '3D [Beta]' },
            ]}
            onSelect={(placement) =>
              dispatch(
                optionsSlice.actions.CHANGE_PANEL_PLACEMENT({ placement })
              )
            }
            defaultValue={panelPlacement(options)}
            Item={Panel}
          />
        )}
      />

      <SettingRow
        label='Cover'
        renderControl={(options) => (
          <OptionsInputField
            parse={(str) => parseInt(str, 10) / 100}
            stringify={(value) => Math.round(value * 100 || 0) + '%'}
            validator={/^-?\d+(%)?$/}
            value={laneCover(options)}
            onChange={(laneCover) =>
              dispatch(optionsSlice.actions.CHANGE_LANE_COVER({ laneCover }))
            }
            style={{ width: '5em' }}
          />
        )}
      />

      <SettingRow
        label='BGA'
        renderControl={(options) => (
          <OptionsCheckbox
            checked={isBackgroundAnimationsEnabled(options)}
            onToggle={() =>
              dispatch(optionsSlice.actions.TOGGLE_BACKGROUND_ANIMATIONS())
            }
          >
            Enable background animations{' '}
            <span className='OptionsPlayerのhint'>(720p, alpha)</span>
          </OptionsCheckbox>
        )}
      />

      <SettingRow
        label='AutoVel'
        renderControl={(options) => (
          <OptionsCheckbox
            checked={isAutoVelocityEnabled(options)}
            onToggle={() =>
              dispatch(optionsSlice.actions.TOGGLE_AUTO_VELOCITY())
            }
          >
            Maintain absolute note velocity{' '}
            <span className='OptionsPlayerのhint'>(advanced)</span>
          </OptionsCheckbox>
        )}
      />

      <SettingRow
        label='Gauge'
        renderControl={(options) => (
          <OptionsCheckbox
            checked={isGaugeEnabled(options)}
            onToggle={() => dispatch(optionsSlice.actions.TOGGLE_GAUGE())}
          >
            Show expert gauge{' '}
            <span className='OptionsPlayerのhint'>(experimental)</span>
          </OptionsCheckbox>
        )}
      />

      <SettingRow
        label='Preview'
        renderControl={(options) => (
          <OptionsCheckbox
            checked={isPreviewEnabled(options)}
            onToggle={() => dispatch(optionsSlice.actions.TOGGLE_PREVIEW())}
          >
            Enable music preview
          </OptionsCheckbox>
        )}
      />

      <div className='OptionsPlayerのbuttons'>
        <OptionsButton onClick={onClose}>Save & Exit</OptionsButton>
      </div>
    </div>
  )
}

export interface OptionsPlayerRowProps {
  hidden: boolean
  label: ReactNode
  children: ReactNode
}

const OptionsPlayerRow = ({
  hidden,
  label,
  children,
}: OptionsPlayerRowProps) => (
  <div className='OptionsPlayerのrow' style={{ display: hidden ? 'none' : '' }}>
    <label>{label}</label>
    <div>{children}</div>
  </div>
)

OptionsPlayer.Row = OptionsPlayerRow

export default OptionsPlayer
