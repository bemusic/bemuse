import './OptionsInput.scss'

import OmniInput, { getName, key川 } from 'bemuse/omni-input'
import React, { useEffect, useRef, useState } from 'react'
import {
  isContinuousAxisEnabled,
  keyboardMapping,
  nextKeyToEdit,
  optionsSlice,
  playMode,
  scratchPosition,
  sensitivity,
} from '../entities/Options'
import { tap, throttleTime } from 'rxjs'
import { useDispatch, useSelector } from 'react-redux'

import { AppState } from '../redux/ReduxState'
import OptionsButton from './OptionsButton'
import OptionsCheckbox from './OptionsCheckbox'
import OptionsInputField from './OptionsInputField'
import OptionsInputKeys from './OptionsInputKeys'
import OptionsInputScratch from './OptionsInputScratch'
import _ from 'lodash'
import c from 'classnames'
import { createSelector } from 'reselect'

const selectKeyboardMapping = createSelector(
  (state: AppState) => state.options,
  (options) => keyboardMapping(options)
)

const selectKeyboardMappingTexts = createSelector(
  selectKeyboardMapping,
  (mapping) => _.mapValues(mapping, getName)
)

const extractState = (state: AppState) => ({
  scratch: scratchPosition(state.options),
  texts: selectKeyboardMappingTexts(state),
  mode: playMode(state.options),
  isContinuous: isContinuousAxisEnabled(state.options),
  sensitivity: sensitivity(state.options),
})

const OptionsInput = () => {
  const dispatch = useDispatch()
  const { scratch, texts, mode, isContinuous, sensitivity } =
    useSelector(extractState)
  const [editing, setEditing] = useState<string | null>(null)
  const omniInput = useRef<OmniInput | null>(null)

  const handleEdit = (key: string) => {
    setEditing((editing) => (editing === key ? null : key))
  }

  const handleKey = (keyCode: string) => {
    if (editing) {
      dispatch(
        optionsSlice.actions.CHANGE_KEY_MAPPING({
          mode,
          key: editing,
          keyCode,
        })
      )
      setEditing(nextKeyToEdit(editing, scratch))
    }
  }

  const handleSensitivityChange = (sensitivity: number) => {
    if (sensitivity < 0) sensitivity = 0
    else if (sensitivity >= 10) sensitivity = 9
    omniInput.current?.setGamepadSensitivity(sensitivity)
    dispatch(optionsSlice.actions.CHANGE_SENSITIVITY({ sensitivity }))
  }

  const handleMinusButtonClick = () => {
    handleSensitivityChange(sensitivity - 1)
  }

  const handlePlusButtonClick = () => {
    handleSensitivityChange(sensitivity + 1)
  }

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (editing) {
        e.preventDefault()
      }
    }

    // XXX: debounce is needed because some gamepad inputs trigger multiple
    // buttons
    const input = new OmniInput(window, {
      continuous: isContinuous,
    })
    omniInput.current = input
    const subscription = key川(input)
      .pipe(throttleTime(16))
      .pipe(tap((key) => console.log('a', key)))
      .subscribe(handleKey)
    window.addEventListener('keydown', handleKeyboardEvent, true)
    return () => {
      subscription.unsubscribe()
      input.dispose()
      window.removeEventListener('keydown', handleKeyboardEvent, true)
    }
  }, [editing])

  const className = c('OptionsInputのbinding', {
    'is-reverse': scratch === 'right',
  })
  const editIndex = (editing: string | null) => {
    if (editing === 'SC') {
      return 0
    }
    if (editing === 'SC2') {
      return 1
    }
    return -1
  }
  return (
    <div className='OptionsInput'>
      <div className={className}>
        {scratch !== 'off' ? (
          <div className='OptionsInputのzone is-scratch'>
            <div className='OptionsInputのcontrol'>
              <OptionsInputScratch
                text={[texts['SC'], texts['SC2']]}
                isEditing={editing === 'SC' || editing === 'SC2'}
                editIndex={editIndex(editing)}
                onEdit={handleEdit}
              />
            </div>
            <div className='OptionsInputのtitle'>Scratch</div>
          </div>
        ) : null}
        <div className='OptionsInputのzone'>
          <div className='OptionsInputのcontrol'>
            <OptionsInputKeys
              keyboardMode={scratch === 'off'}
              texts={texts}
              editing={editing}
              onEdit={handleEdit}
            />
          </div>
          <div className='OptionsInputのtitle'>Keys</div>
        </div>
      </div>
      <div className='OptionsInputのgamepad'>
        <div className='OptionsInputのgroup'>
          <label>Continuous Axis</label>
          <OptionsCheckbox
            checked={isContinuous}
            onToggle={() => {
              dispatch(optionsSlice.actions.TOGGLE_CONTINUOUS_AXIS())
              omniInput.current?.setGamepadContinuousAxisEnabled(!isContinuous)
            }}
          />
        </div>
        <div className='OptionsInputのgroup'>
          <label>Sensitivity</label>
          <div className='OptionsInputのsensitivity'>
            <span className='OptionsInputのminus'>
              <OptionsButton onClick={handleMinusButtonClick}>-</OptionsButton>
            </span>
            <OptionsInputField
              parse={(str) => parseInt(str, 10) - 1}
              stringify={(value) => String(value + 1)}
              validator={/^[0-9]+$/}
              value={sensitivity}
              onChange={handleSensitivityChange}
            />
            <span className='OptionsInputのplus'>
              <OptionsButton onClick={handlePlusButtonClick}>+</OptionsButton>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionsInput
