
import './options-input.scss'
import React                from 'react'
import { Binding }          from 'bemuse/flux'
import Store                from '../stores/options-input-store'
import * as Actions         from '../actions/options-input-actions'
import OptionsInputScratch  from './options-input-scratch'
import OptionsInputKeys     from './options-input-keys'

export default React.createClass({
  render() {
    return <div className="options-input">
      <Binding store={Store} onChange={this.handleState} />
      <div className="options-input--zone is-scratch">
        <div className="options-input--control">
          <OptionsInputScratch text={this.state.texts['SC']}
              isEditing={this.state.editing === 'SC'}
              onEdit={this.handleEdit} />
        </div>
        <div className="options-input--title">
          Scratch
        </div>
      </div>
      <div className="options-input--zone">
        <div className="options-input--control">
          <OptionsInputKeys
              texts={this.state.texts}
              editing={this.state.editing}
              onEdit={this.handleEdit} />
        </div>
        <div className="options-input--title">
          Keys
        </div>
      </div>
    </div>
  },
  getInitialState() {
    return Store.get()
  },
  handleState(state) {
    this.setState(state)
  },
  handleEdit(key) {
    if (this.state.editing === key) {
      Actions.deselectKey()
    } else {
      Actions.selectKey(key)
    }
  },
  componentDidMount() {
    window.addEventListener('keydown', this.handleKey, true)
  },
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKey, true)
  },
  handleKey(e) {
    if (this.state.editing) {
      e.stopPropagation()
      e.preventDefault()
      Actions.setKeyCode(this.state.editing, e.keyCode)
    }
  },
})
