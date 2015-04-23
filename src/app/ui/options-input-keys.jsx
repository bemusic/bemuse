
import './options-input-keys.scss'
import React from 'react'
import c     from 'classnames'

import OptionsInputKey from './options-input-key'

export default React.createClass({
  render() {
    return <div className="options-input-keys">
      <div className="options-input-keys--keys">
        <OptionsInputKey n={1} />
        <OptionsInputKey n={2} />
        <OptionsInputKey n={3} />
        <OptionsInputKey n={4} />
        <OptionsInputKey n={5} />
        <OptionsInputKey n={6} />
        <OptionsInputKey n={7} />
      </div>
    </div>
  }
})
