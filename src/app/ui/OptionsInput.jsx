
import './OptionsInput.scss'
import React                from 'react'
import c                    from 'classnames'
import { connect }          from 'bemuse/flux'
import Store                from '../stores/options-input-store'
import * as Actions         from '../actions/options-input-actions'
import OptionsInputScratch  from './OptionsInputScratch'
import OptionsInputKeys     from './OptionsInputKeys'

export const OptionsInput = React.createClass({
  render () {
    const className = c('OptionsInput', {
      'is-reverse': this.props.scratch === 'right'
    })
    return <div className={className}>
      {this.props.scratch !== 'off'
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
  },
  handleEdit (key) {
    if (this.props.editing === key) {
      Actions.deselectKey()
    } else {
      Actions.selectKey(key)
    }
  },
  componentDidMount () {
    window.addEventListener('keydown', this.handleKey, true)
  },
  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKey, true)
  },
  handleKey (e) {
    if (this.props.editing) {
      e.stopPropagation()
      e.preventDefault()
      Actions.setKeyCode(this.props.mode, this.props.editing, e.keyCode)
    }
  },
})

export default connect(Store, OptionsInput)
