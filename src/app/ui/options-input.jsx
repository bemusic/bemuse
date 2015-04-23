
import './options-input.scss'
import React    from 'react'
import keycode  from 'keycode'

import OptionsInputScratch from './options-input-scratch'
import OptionsInputKeys    from './options-input-keys'

export default React.createClass({
  render() {
    return <div className="options-input">
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
    return {
      editing: null,
      order: ['SC', '1', '2', '3', '4', '5', '6', '7', null],
      texts: {
        'SC': 'Shift', '1': 'Z', '2': 'S', '3': 'X',
        '4': 'D', '5': 'C', '6': 'F', '7': 'V',
      },
    }
  },
  handleEdit(key) {
    if (this.state.editing === key) {
      this.setState({ editing: null })
    } else {
      this.setState({ editing: key })
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
      this.state.texts[this.state.editing] = keycode(e.keyCode)
          .replace(/[a-z]/, x => x.toUpperCase())
      let index = this.state.order.indexOf(this.state.editing)
      this.setState({ editing: this.state.order[index + 1] })
    }
  },
})
