import * as Options         from '../entities/Options'
import * as OptionsIO       from '../io/OptionsIO'
import './OptionsInput.scss'

import _                    from 'lodash'
import c                    from 'classnames'
import React                from 'react'
import PropTypes            from 'prop-types'
import { key川 }            from 'bemuse/omni-input'
import { getName }          from 'bemuse/omni-input'
import { connect }          from 'react-redux'
import { compose, withState, withHandlers } from 'recompose'
import { createSelector }   from 'reselect'

import connectIO            from '../../impure-react/connectIO'
import OptionsInputKeys     from './OptionsInputKeys'
import OptionsInputScratch  from './OptionsInputScratch'

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
  })),
  withState('editing', 'setEditing', null),
  connectIO({
    onSetKeyCode: ({ mode, editing }) => (keyCode) => (
      OptionsIO.updateOptions(Options.changeKeyMapping(mode, editing, keyCode))
    )
  }),
  withHandlers({
    onEdit: ({ editing, setEditing }) => (key) => {
      if (editing === key) {
        setEditing(null)
      } else {
        setEditing(key)
      }
    },
    onKey: ({ editing, onSetKeyCode, setEditing, scratch }) => (keyCode) => {
      if (editing) {
        onSetKeyCode(keyCode)
        setEditing(Options.nextKeyToEdit(editing, scratch))
      }
    }
  })
)

class OptionsInput extends React.Component {
  static propTypes = {
    scratch: PropTypes.string,
    texts: PropTypes.array,
    editing: PropTypes.string,
    mode: PropTypes.string,
  }
  render () {
    const className = c('OptionsInput', {
      'is-reverse': this.props.scratch === 'right'
    })
    return <div className={className}>
      {
        this.props.scratch !== 'off'
        ? (
          <div className="OptionsInputのzone is-scratch">
            <div className="OptionsInputのcontrol">
              <OptionsInputScratch
                text={[this.props.texts['SC'], this.props.texts['SC2']]}
                isEditing={
                  this.props.editing === 'SC' ||
                  this.props.editing === 'SC2'
                }
                editIndex={this.props.editing === 'SC'
                  ? 0
                  : this.props.editing === 'SC2' ? 1 : -1
                }
                onEdit={this.handleEdit}
              />
            </div>
            <div className="OptionsInputのtitle">
              Scratch
            </div>
          </div>
        )
        : null
      }
      <div className="OptionsInputのzone">
        <div className="OptionsInputのcontrol">
          <OptionsInputKeys
            keyboardMode={this.props.scratch === 'off'}
            texts={this.props.texts}
            editing={this.props.editing}
            onEdit={this.handleEdit}
          />
        </div>
        <div className="OptionsInputのtitle">
          Keys
        </div>
      </div>
    </div>
  }
  handleEdit (key) {
    this.props.onEdit(key)
  }
  componentDidMount () {
    // XXX: debounce is needed because some gamepad inputs trigger multiple
    // buttons
    this._dispose = key川().debounceImmediate(16).doLog('a').onValue(this.handleKey)
    window.addEventListener('keydown', this.handleKeyboardEvent, true)
  }
  componentWillUnmount () {
    if (this._dispose) this._dispose()
    window.removeEventListener('keydown', this.handleKeyboardEvent, true)
  }
  handleKey (key) {
    if (this.props.editing) {
      this.props.onKey(key)
    }
  }
  handleKeyboardEvent (e) {
    if (this.props.editing) {
      e.preventDefault()
    }
  }
}

export default enhance(OptionsInput)
