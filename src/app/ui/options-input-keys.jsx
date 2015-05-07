
import './options-input-keys.scss'
import React from 'react'

import OptionsInputKey from './options-input-key'

export default React.createClass({
  render() {
    let keys = []
    for (let i = 1; i <= 7; i++) {
      keys.push(<OptionsInputKey
          n={i}
          text={this.props.texts[i]}
          isEditing={'' + i === '' + this.props.editing}
          onEdit={this.props.onEdit} />)
    }
    return <div className="options-input-keys"
        data-arrangement={this.props.keyboardMode ? 'kb' : 'bm'}>
      <div className="options-input-keys--keys">
        {keys}
      </div>
    </div>
  }
})
