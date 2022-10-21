import './OptionsInput.scss'

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import c from 'classnames'
import { compose, withHandlers, withState } from 'recompose'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import OmniInput, { getName, key川 } from 'bemuse/omni-input'

import * as Options from '../entities/Options'
import * as OptionsIO from '../io/OptionsIO'
import OptionsInputKeys from './OptionsInputKeys'
import OptionsInputScratch from './OptionsInputScratch'
import connectIO from '../../impure-react/connectIO'
import OptionsCheckbox from './OptionsCheckbox'
import OptionsInputField from './OptionsInputField'
import OptionsButton from './OptionsButton'

const selectKeyboardMapping = createSelector(
  (state) => state.options,
  (options) => Options.keyboardMapping(options)
)

const selectKeyboardMappingTexts = createSelector(
  selectKeyboardMapping,
  (mapping) => _.mapValues(mapping, getName)
)

const enhance = compose(
  connect((state) => ({
    scratch: Options.scratchPosition(state.options),
    texts: selectKeyboardMappingTexts(state),
    mode: Options.playMode(state.options),
    isContinuous: Options.isContinuousAxisEnabled(state.options),
    sensitivity: Options.sensitivity(state.options),
  })),
  withState('editing', 'setEditing', null),
  connectIO({
    onSetKeyCode:
      ({ mode, editing }) =>
      (keyCode) =>
        OptionsIO.updateOptions(
          Options.changeKeyMapping(mode, editing, keyCode)
        ),
    onUpdateOptions: () => (updater) => OptionsIO.updateOptions(updater),
  }),
  withHandlers({
    onEdit:
      ({ editing, setEditing }) =>
      (key) => {
        if (editing === key) {
          setEditing(null)
        } else {
          setEditing(key)
        }
      },
    onKey:
      ({ editing, onSetKeyCode, setEditing, scratch }) =>
      (keyCode) => {
        if (editing) {
          onSetKeyCode(keyCode)
          setEditing(Options.nextKeyToEdit(editing, scratch))
        }
      },
  })
)

class OptionsInput extends React.Component {
  static propTypes = {
    scratch: PropTypes.string,
    texts: PropTypes.object,
    editing: PropTypes.string,
    onEdit: PropTypes.func,
    onKey: PropTypes.func,
    isContinuous: PropTypes.bool,
    sensitivity: PropTypes.number,
    onUpdateOptions: PropTypes.func,
  }

  render() {
    const className = c('OptionsInputのbinding', {
      'is-reverse': this.props.scratch === 'right',
    })
    return (
      <div className='OptionsInput'>
        <div className={className}>
          {this.props.scratch !== 'off' ? (
            <div className='OptionsInputのzone is-scratch'>
              <div className='OptionsInputのcontrol'>
                <OptionsInputScratch
                  text={[this.props.texts['SC'], this.props.texts['SC2']]}
                  isEditing={
                    this.props.editing === 'SC' || this.props.editing === 'SC2'
                  }
                  editIndex={
                    this.props.editing === 'SC'
                      ? 0
                      : this.props.editing === 'SC2'
                      ? 1
                      : -1
                  }
                  onEdit={this.handleEdit}
                />
              </div>
              <div className='OptionsInputのtitle'>Scratch</div>
            </div>
          ) : null}
          <div className='OptionsInputのzone'>
            <div className='OptionsInputのcontrol'>
              <OptionsInputKeys
                keyboardMode={this.props.scratch === 'off'}
                texts={this.props.texts}
                editing={this.props.editing}
                onEdit={this.handleEdit}
              />
            </div>
            <div className='OptionsInputのtitle'>Keys</div>
          </div>
        </div>
        <div className='OptionsInputのgamepad'>
          <div className='OptionsInputのgroup'>
            <label>Continuous Axis</label>
            <OptionsCheckbox
              checked={this.props.isContinuous}
              onToggle={() => {
                this.props.onUpdateOptions(Options.toggleContinuousAxis)
                this._input.setGamepadContinuousAxisEnabled(
                  !this.props.isContinuous
                )
              }}
            />
          </div>
          <div className='OptionsInputのgroup'>
            <label>Sensitivity</label>
            <div className='OptionsInputのsensitivity'>
              <span className='OptionsInputのminus'>
                <OptionsButton onClick={this.handleMinusButtonClick}>
                  -
                </OptionsButton>
              </span>
              <OptionsInputField
                parse={(str) => parseInt(str, 10) - 1}
                stringify={(value) => String(parseInt(value, 10) + 1)}
                validator={/^[0-9]+$/}
                value={this.props.sensitivity}
                onChange={this.handleSensitivityChange}
              />
              <span className='OptionsInputのplus'>
                <OptionsButton onClick={this.handlePlusButtonClick}>
                  +
                </OptionsButton>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleEdit = (key) => {
    this.props.onEdit(key)
  }

  componentDidMount() {
    // XXX: debounce is needed because some gamepad inputs trigger multiple
    // buttons
    this._input = new OmniInput(window, {
      continuous: this.props.isContinuous,
    })
    this._dispose = key川(this._input)
      .debounceImmediate(16)
      .doLog('a')
      .onValue(this.handleKey)
    window.addEventListener('keydown', this.handleKeyboardEvent, true)
  }

  componentWillUnmount() {
    if (this._dispose) this._dispose()
    if (this._input) this._input.dispose()
    window.removeEventListener('keydown', this.handleKeyboardEvent, true)
  }

  handleKey = (key) => {
    if (this.props.editing) {
      this.props.onKey(key)
    }
  }

  handleKeyboardEvent = (e) => {
    if (this.props.editing) {
      e.preventDefault()
    }
  }

  handleSensitivityChange = (sensitivity) => {
    if (sensitivity < 0) sensitivity = 0
    else if (sensitivity >= 10) sensitivity = 9
    this._input.setGamepadSensitivity(sensitivity)
    this.props.onUpdateOptions(Options.changeSensitivity(sensitivity))
  }

  handleMinusButtonClick = () => {
    this.handleSensitivityChange(parseInt(this.props.sensitivity, 10) - 1)
  }

  handlePlusButtonClick = () => {
    this.handleSensitivityChange(parseInt(this.props.sensitivity, 10) + 1)
  }
}

export default enhance(OptionsInput)
