
import './OptionsCheckbox.scss'
import React from 'react'

const OptionsCheckbox = ({ checked, children, onToggle }) => {
  return (
    <span className="OptionsCheckbox">
      <label>
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="OptionosCheckboxのレーベル">
          {' '}{children}
        </span>
      </label>
    </span>
  )
}

OptionsCheckbox.propTypes = {
  checked: React.PropTypes.bool,
  children: React.PropTypes.node,
  onToggle: React.PropTypes.func
}

export default OptionsCheckbox
