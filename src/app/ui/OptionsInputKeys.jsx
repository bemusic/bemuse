
import './OptionsInputKeys.scss'
import React from 'react'
import pure  from 'recompose/pure'

import OptionsInputKey from './OptionsInputKey'

export const OptionsInputKeys = React.createClass({
  render () {
    let keys = []
    for (let i = 1; i <= 7; i++) {
      keys.push(<OptionsInputKey
        n={i}
        key={i}
        text={this.props.texts[i]}
        isEditing={'' + i === '' + this.props.editing}
        onEdit={this.props.onEdit} />)
    }
    return <div className="OptionsInputKeys"
      data-arrangement={this.props.keyboardMode ? 'kb' : 'bm'}>
      <div className="OptionsInputKeysのkeys">
        {keys}
      </div>
    </div>
  }
})

export default pure(OptionsInputKeys)
