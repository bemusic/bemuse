
import './OptionsInput.scss'
import React                from 'react'
import c                    from 'classnames'
import { Binding }          from 'bemuse/flux'
import Store                from '../stores/options-input-store'
import * as Actions         from '../actions/options-input-actions'
import OptionsInputScratch  from './OptionsInputScratch'
import OptionsInputKeys     from './OptionsInputKeys'

export default React.createClass({
  render () {
    return <div className={c('OptionsInput', {
        'is-reverse': this.state.scratch === 'right' })}>
      <Binding store={Store} onChange={this.handleState} />
      {this.state.scratch !== 'off'
        ? <div className="OptionsInputのzone is-scratch">
            <div className="OptionsInputのcontrol">
              <OptionsInputScratch
                  text={[this.state.texts['SC'], this.state.texts['SC2']]}
                  isEditing={
                    this.state.editing === 'SC' ||
                    this.state.editing === 'SC2'
                  }
                  editIndex={this.state.editing === 'SC'
                    ? 0
                    : this.state.editing === 'SC2' ? 1 : -1
                  }
                  onEdit={this.handleEdit} />
            </div>
            <div className="OptionsInputのtitle">
              Scratch
            </div>
          </div>
        : null
      }
      <div className="OptionsInputのzone">
        <div className="OptionsInputのcontrol">
          <OptionsInputKeys
              keyboardMode={this.state.scratch === 'off'}
              texts={this.state.texts}
              editing={this.state.editing}
              onEdit={this.handleEdit} />
        </div>
        <div className="OptionsInputのtitle">
          Keys
        </div>
      </div>
    </div>
  },
  getInitialState () {
    return Store.get()
  },
  handleState (state) {
    this.setState(state)
  },
  handleEdit (key) {
    if (this.state.editing === key) {
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
    if (this.state.editing) {
      e.stopPropagation()
      e.preventDefault()
      Actions.setKeyCode(this.state.mode, this.state.editing, e.keyCode)
    }
  },
})
