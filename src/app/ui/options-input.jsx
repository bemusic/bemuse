
import './options-input.scss'
import React from 'react'
import c     from 'classnames'

import OptionsInputScratch from './options-input-scratch'
import OptionsInputKeys    from './options-input-keys'

export default React.createClass({
  render() {
    return <div className="options-input">
      <div className="options-input--zone is-scratch">
        <div className="options-input--control">
          <OptionsInputScratch />
        </div>
        <div className="options-input--title">
          Scratch
        </div>
      </div>
      <div className="options-input--zone">
        <div className="options-input--control">
          <OptionsInputKeys />
        </div>
        <div className="options-input--title">
          Keys
        </div>
      </div>
    </div>
  }
})
